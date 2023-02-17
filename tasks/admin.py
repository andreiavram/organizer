from django.contrib import admin
from django.utils.safestring import mark_safe

from tasks.models import TaskItem, Project, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag
    exclude = ("slug", )


class ProjectAdmin(admin.ModelAdmin):
    model = Project
    exclude = ("slug", )


class TaskAdmin(admin.ModelAdmin):
    model = TaskItem
    list_display = ("title", "project", "get_tags")
    exclude = ['completed_date']

    def get_tags(self, instance):
        return mark_safe(", ".join([f"{t}" for t in instance.tags.all()]))


admin.site.register(TaskItem, TaskAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Tag, TagAdmin)

