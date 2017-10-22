from django.contrib import admin
from organize.models import TaskItem, Project, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag
    exclude = ("slug", )

class ProjectAdmin(admin.ModelAdmin):
    model = Project
    exclude = ("slug", )

class TaskAdmin(admin.ModelAdmin):
    model = TaskItem
    list_display = ("title", "project")

admin.site.register(TaskItem, TaskAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Tag, TagAdmin)

