# Generated by Django 5.0.7 on 2024-08-01 07:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0002_question_language_question_unit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='unit',
            field=models.IntegerField(default=1),
        ),
    ]