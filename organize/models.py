# coding: utf8
from django.db import models

# Create your models here.

TAKSITEM_STATUSES = (
    ("idea", "Idee"),
    ("inpregatire", u"În pregătire"),
    ("inprogress", u"În lucru"),
    ("finalizata", u"Finalizată"),
    ("renunt", u"Given up")
)


class TaskItem(models.Model):
    title = models.CharField(max_length=1024)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    estimated_time = models.IntegerField(null=True, blank=True)

    parent_task = models.ForeignKey("TaskItem", null=True, blank=True)

    created_date = models.DateTimeField(auto_now_add=True)
    changed_date = models.DateTimeField(auto_now=True)

    status = models.CharField(max_length=255, choices=TAKSITEM_STATUSES)
    owner = models.ForeignKey("auth.User", null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __unicode__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=1024)
    description = models.TextField(null=True, blank=True)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __unicode__(self):
        return self.title
