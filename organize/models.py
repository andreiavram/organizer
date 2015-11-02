# coding: utf8
from django.db import models
from django.utils.text import slugify
from model_utils.fields import MonitorField


class TaskItem(models.Model):
    IDEA = 'idea'
    BLOCKED = 'blocked'
    IN_PROGRESS = 'inprogress'
    GIVEN_UP = 'givenup'
    TAKSITEM_STATUSES = (
        (IDEA, u"Idee"),
        (BLOCKED, u"Blocată"),
        (IN_PROGRESS, u"În lucru"),
        (GIVEN_UP, u"Am renunțat")
    )

    HIGH = 4
    NORMAL = 2
    LOW = 1

    TASKITEM_PRIORITIES = (
        (HIGH, u"Prioritară"),
        (NORMAL, u"Neutră"),
        (LOW, u"Joasă")
    )

    title = models.CharField(max_length=1024)
    description = models.TextField(null=True, blank=True)

    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)  # deadline
    completed_date = MonitorField(monitor='completed', when=[True, ])
    estimated_time = models.IntegerField(null=True, blank=True)

    parent_task = models.ForeignKey("TaskItem", null=True, blank=True)

    order = models.IntegerField(default=0)

    created_date = models.DateTimeField(auto_now_add=True)
    changed_date = models.DateTimeField(auto_now=True)

    status = models.CharField(max_length=255, choices=TAKSITEM_STATUSES, default=IDEA)
    completed = models.BooleanField(default=False)
    priority = models. IntegerField(max_length=255, choices=TASKITEM_PRIORITIES, default=NORMAL)

    owner = models.ForeignKey("auth.User", null=True, blank=True)
    tags = models.ManyToManyField("organize.Tag", null=True, blank=True, related_name="tasks")

    project = models.ForeignKey("organize.Project", null=True, blank=True, related_name="tasks")

    class Meta:
        ordering = ["order", "-priority", "-start_date", "-created_date"]

    def __unicode__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=1024)
    description = models.TextField(null=True, blank=True)
    slug = models.SlugField()

    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    tags = models.ManyToManyField("organize.Tag", null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __unicode__(self):
        return self.title

    def save(self, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Project, self).save(**kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.CharField(max_length=1024, null=True, blank=True)
    color = models.CharField(max_length=7, default="#FFFFFF")

    def save(self, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Tag, self).save(**kwargs)

    def __unicode__(self):
        return self.name


class TaskComment(models.Model):
    user = models.ForeignKey("auth.User", )
    timestamp = models.DateTimeField(auto_now=True)
    description = models.TextField(null=True, blank=True)
    task = models.ForeignKey(TaskItem)

    def __unicode__(self):
        return self.description
