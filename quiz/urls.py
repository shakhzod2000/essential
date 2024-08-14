# quiz/urls.py
from django.urls import path
from .views import insert_questions, home, get_questions

urlpatterns = [
    path('', home, name='home'),
    path('api/insert_questions/', insert_questions, name='insert_questions'),
    path('api/questions/', get_questions, name='get_questions'),
]
