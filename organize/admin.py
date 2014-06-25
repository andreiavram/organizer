from django.contrib import admin

# Register your models here.
from organize.models import TaskItem, Project

admin.site.register(TaskItem)
admin.site.register(Project)