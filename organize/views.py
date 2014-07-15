from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.contrib import messages

# Create your views here.
from django.utils.decorators import method_decorator
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView
from organize.forms import TaskItemForm
from organize.models import TaskItem
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework import generics
from organize.permissions import IsOwnerOrReadOnly
from organize.serializers import TaskSerializer


class TaskList(ListView):
    model = TaskItem

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TaskList, self).dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return super(TaskList, self).get_queryset().filter(owner=self.request.user)


class TaskCreate(CreateView):
    model = TaskItem
    form_class = TaskItemForm

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TaskCreate, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.owner = self.request.user
        self.object.save()
        messages.success("Task has been saved")
        return HttpResponseRedirect(reverse("task_list"))


class TaskItemViewSet(viewsets.ModelViewSet):
    queryset = TaskItem.objects.all()
    serializer_class = TaskSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

