from rest_auth.serializers import TokenSerializer
from rest_framework.authtoken.models import Token
from organize.models import TaskItem, Tag, Project, TaskComment
from rest_framework import serializers


__author__ = 'andrei'


class TaskCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskComment
        fields = ("id", "description", "user", "timestamp")


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskItem
        fields = ("id", "title", "description", "start_date", "end_date", "estimated_time", "parent_task", "status",
                  "owner", "priority", "completed", "tags", "completed_date", "changed_date", "order", "project",
                  "comments")

    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    comments = TaskCommentSerializer(many=True, read_only=True)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "slug", "name", "description", "color", "count")

    slug = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()

    def get_count(self, obj):
        return obj.tasks.count()

    def get_slug(self, obj):
        return obj.slug


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id", "slug", "title", "description", "start_date", "end_date", "tags", "tasks")

    tasks = TaskSerializer(many=True, read_only=True)
    slug = serializers.ReadOnlyField()


class UserTokenSerializer(TokenSerializer):
    class Meta:
        model = Token
        fields = ('key', 'user', 'role')

    user = serializers.SerializerMethodField("user_username")
    role = serializers.SerializerMethodField("user_role")

    def user_username(self, obj):
        return obj.user.username

    def user_role(self, obj):
        #   TODO: implement roles
        return "admin"

