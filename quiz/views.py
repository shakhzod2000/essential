# quiz/views.py
# from django.db import connection
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Quiz, Question, Option


def home(request):
    return render(request, 'quiz.html')

def get_questions(request):
    unit = request.GET.get('unit')
    language = request.GET.get('language')
    book = request.GET.get('book')

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


# @csrf_exempt
# def insert_questions(request):
#     if request.method == 'POST':
#         try:
#             quiz = Quiz.objects.create(title='Essential Quiz', book='E1')
#             all_questions = json.loads(request.body).get('all_questions')

#             for question_data in all_questions:
#                 question = Question.objects.create(
#                     quiz=quiz,
#                     numb=question_data['numb'],
#                     question=question_data['question'],
#                     answer=question_data['answer'],
#                     unit=question_data['unit'],
#                     language=question_data['language']
#                 )

#                 for option_text in question_data['options']:
#                     Option.objects.create(
#                         question=question,
#                         option_text=option_text
#                     )
#             return JsonResponse({'message': 'Questions inserted successfully'}, status=200)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
#     return JsonResponse({'error': 'Invalid request method'}, status=405)
