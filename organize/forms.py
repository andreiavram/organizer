from django import forms
from goodies.forms import CrispyBaseModelForm
from goodies.widgets import BootstrapDateTimeInput
from organize.models import TAKSITEM_STATUSES, TaskItem

__author__ = 'andrei'


class TaskItemForm(CrispyBaseModelForm):
    class Meta:
        model = TaskItem
        exclude = ("owner", "parent_task", "status")


    start_date = forms.DateTimeField(widget=BootstrapDateTimeInput, required=True)
    end_date = forms.DateTimeField(widget=BootstrapDateTimeInput, required=False)
