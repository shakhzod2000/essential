# Generated by Django 5.0.7 on 2024-08-02 11:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0003_alter_question_unit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='option',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='options', to='quiz.question'),
        ),
        migrations.AlterField(
            model_name='question',
            name='language',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='question',
            name='unit',
            field=models.IntegerField(),
        ),
    ]
