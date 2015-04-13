from django.contrib import admin
from organize.models import TaskItem, Project, Tag


class TagAdmin(admin.ModelAdmin):
    model = Tag
    exclude = ("slug", )

admin.site.register(TaskItem)
admin.site.register(Project)
admin.site.register(Tag, TagAdmin)