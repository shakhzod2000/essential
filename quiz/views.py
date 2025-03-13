# quiz/views.py
# from django.db import connection
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Quiz, Question, Option
import boto3
import botocore
from django.conf import settings
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import SignUpForm


def home(request):
    return render(request, 'home.html')

def quiz_test(request):
    return render(request, 'quiz-test.html')

def quiz_result(request):
    return render(request, 'quiz-result.html')

def register(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Automatically login after successful sign-up
            login(request, user)
            messages.success(request, 'Account created successfully.')
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, 'You have successfully logged out.')
    return redirect('home')


def get_questions(request):
    language = request.GET.get('language')
    book = request.GET.get('book')
    unit = request.GET.get('unit')

    if unit and language and book:
        # Fetch questions from database filtered by unit, language and book
        questions = Question.objects.filter(quiz__book=book, unit=unit, language=language)
        questions_list = []
        # Loop through questions and get options for each question
        for question in questions:
            options = Option.objects.filter(question=question)
            # Get list of option texts
            options_list = [option.option_text for option in options]
            # Append each question and its options to the questions_list
            questions_list.append({
                'numb': question.numb,
                'question': question.question,
                'answer': question.answer,
                'options': options_list
            })
        # Return list of questions as JSON response
        print(f"Questions list: {questions_list}")
        return JsonResponse(questions_list, safe=False)
    else:
        # Return error response if unit or language parameter is missing
        return JsonResponse({'error': 'Missing book, unit or language parameter'}, status=400)


@csrf_exempt
def get_pronunciation(request):
    """
    API endpoint to get pronunciation of a word.
    Expects query parameters:
        - word: the word to pronounce
        - accent: "american" or "british" (default: american)
    """

    accent = request.GET.get('accent')
    book = request.GET.get('book')
    unit = request.GET.get('unit')
    word = request.GET.get('word')

    if not word or not book or not unit:
        return JsonResponse({'error': 'No word, book or unit provided'}, status=400)

    #Defining s3 bucket name and folder structure
    bucket_name = settings.AWS_S3_BUCKET
    folder = 'american' if accent == 'american' else 'british'
    key = f"audios/{folder}/{book}/unit{unit}/{word.lower()}.mp3"

    # Initialize boto3 clients
    s3 = boto3.client('s3', region_name=settings.AWS_REGION)
    polly = boto3.client('polly', region_name=settings.AWS_REGION)

    # Check if file exists in s3
    try:
        # head_object returns metadata of object(s3) like size, last modified time, content type etc. Doesn't return object(s3) itself. Useful to check if object(s3) exists
        s3.head_object(Bucket=bucket_name, Key=key)
        file_exists = True
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == '404':
            file_exists = False
        else:
            return JsonResponse({'error': 'Error checking s3'}, status=500)
        
    if file_exists:
        # Construct URL or generate presigned URL if bucket(s3) is private
        # url = f"https://{bucket_name}.s3.amazonaws.com/{key}"
        url = s3.generate_presigned_url(
            'get_object',
            Params = {'Bucket': bucket_name, 'Key': key},
            ExpiresIn = 3600
        )
        return JsonResponse({'url': url})
    else:
        # Generate voice, choose voice id based on accent
        voice_id = 'Ruth' if accent == 'american' else 'Amy'
        try:
            polly_response = polly.synthesize_speech(
                Text = word,
                OutputFormat = 'mp3',
                VoiceId = voice_id,
                Engine = 'generative'
            )
        except Exception as e:
            print(f"Polly error: {e}")
            return JsonResponse({'error': 'Error calling Amazon Polly'}, status=500)
        
        audio_stream = polly_response.get('AudioStream')
        if audio_stream:
            try:
                s3.put_object(
                    Bucket = bucket_name,
                    Key = key,
                    Body = audio_stream.read(),
                    ContentType = 'audio/mpeg'
                )
            except Exception as e:
                print(f"S3 put_object error: {e}")
                return JsonResponse({'error': 'Error uploading to S3'}, status=500)
            # url = f"https://{bucket_name}.s3.amazonaws.com/{key}"
            url = s3.generate_presigned_url(
                'get_object',
                Params = {'Bucket': bucket_name, 'Key': key},
                ExpiresIn = 3600
            )
            return JsonResponse({'url': url})
        else:
            return JsonResponse({'error': 'No audio generated'}, status=500)
