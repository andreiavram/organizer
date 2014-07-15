from organize.models import TaskItem

__author__ = 'andrei'

from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = ("id", "title", "description", "start_date", "end_date", "estimated_time", "parent_task", "status", "owner")