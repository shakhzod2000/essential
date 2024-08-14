# models.py
from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    book = models.CharField(max_length=255)

    class Meta:
        db_table = 'quizzes'

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    numb = models.IntegerField()
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    unit = models.IntegerField()
    language = models.CharField(max_length=255)

    class Meta:
        db_table = 'questions'

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option_text = models.CharField(max_length=255)

    class Meta:
        db_table = 'options'
