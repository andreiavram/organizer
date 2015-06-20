from django.contrib import admin
from organize.models import TaskItem, Project, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag
    exclude = ("slug", )

class ProjectAdmin(admin.ModelAdmin):
    model = Project
    exclude = ("slug", )

admin.site.register(TaskItem)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Tag, TagAdmin)