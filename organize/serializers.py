from django.db.models.aggregates import Count
from organize.models import TaskItem, Tag, Project

__author__ = 'andrei'

from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = ("id", "title", "description", "start_date", "end_date", "estimated_time", "parent_task", "status",
                  "owner", "priority", "completed", "tags", "completed_date", "changed_date", "order", "project")

    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "slug", "name", "description", "color", "count")

    count = serializers.SerializerMethodField()

    def get_count(self, obj):
        return obj.tasks.count()


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id", "slug", "title", "description", "start_date", "end_date", "tags", "tasks")

        tasks = TaskSerializer(many=True, read_only=True)