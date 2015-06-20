from django.contrib.auth.decorators import login_required

# Create your views here.
from django.db.models.query_utils import Q
from django.utils.decorators import method_decorator
from django.views.generic.base import TemplateView
from organize.models import TaskItem, Tag, Project
from rest_framework import viewsets, permissions
from organize.serializers import TaskSerializer, TagSerializer, ProjectSerializer


class MainAppView(TemplateView):
    template_name = "organize/main_app.html"

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(MainAppView, self).dispatch(request, *args, **kwargs)


class TaskItemViewSet(viewsets.ModelViewSet):
    queryset = TaskItem.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def __init__(self, *args, **kwargs):
        self.query_tags = []
        self.query_string = None
        self.filter_completed = False
        super(TaskItemViewSet, self).__init__(*args, **kwargs)

    def filter_queryset(self, queryset):
        if self.query_tags:
            queryset = queryset.filter(tags__id__in=[int(t) for t in self.query_tags]).distinct()
        if self.query_string:
            queryset = queryset.filter(Q(title__icontains=self.query_string) | Q(description__icontains=self.query_string))
        if self.filter_completed:
            queryset = queryset.exclude(completed=True)
        return super(TaskItemViewSet, self).filter_queryset(queryset)

    def list(self, request, *args, **kwargs):
        self.query_tags = request.GET.getlist("tags")
        self.query_string = request.GET.get("query", None)
        self.filter_completed = request.GET.get("completed", "false") == "true"
        return super(TaskItemViewSet, self).list(request, *args, **kwargs)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def __init__(self, *args, **kwargs):
        self.query_slug = None
        self.query_tags = []
        super(TagViewSet, self).__init__(*args, **kwargs)

    def filter_queryset(self, queryset):
        if self.query_slug:
            queryset = queryset.filter(slug__icontains=self.query_slug)
        return super(TagViewSet, self).filter_queryset(queryset)

    def list(self, request, *args, **kwargs):
        self.query_slug = request.GET.get("slug")
        return super(TagViewSet, self).list(request, *args, **kwargs)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated, )