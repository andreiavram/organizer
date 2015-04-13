from organize.models import TaskItem, Tag

__author__ = 'andrei'

from rest_framework import serializers


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = ("id", "title", "description", "start_date", "end_date", "estimated_time", "parent_task", "status",
                  "owner", "priority", "completed", "tags", "completed_date")

    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "slug", "name", "color")