# quiz/urls.py
from django.urls import path
from .views import home, quiz_test, quiz_result, get_questions, get_pronunciation, register, login_view, logout_view

urlpatterns = [
    path('', home, name='home'),
    path('quiz-test/', quiz_test, name='quiz_test'),
    path('quiz-result/', quiz_result, name='quiz_result'),
    path('api/questions/', get_questions, name='get_questions'),
    path('api/tts/', get_pronunciation, name='get_pronunciation'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login_view'),
    path('logout/', logout_view, name='logout_view')
]
