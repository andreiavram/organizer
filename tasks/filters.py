from django.db.models import Q
from django_filters import rest_framework as filters

from tasks.models import TaskItem, Tag


class OrLookupFilter(filters.CharFilter):
    def __init__(self, lookup_dict=None, *args, **kwargs):
        self.lookup_dict = lookup_dict
        super(OrLookupFilter, self).__init__(*args, **kwargs)

    def filter(self, qs, value):
        if not value:
            return qs
        if self.distinct:
            qs = qs.distinct()
        lookup = Q()

        if self.lookup_dict:
            for field_name, lookup_expr in self.lookup_dict.items():
                lookup.add(Q(**{f"{field_name}__{lookup_expr}": value}), Q.OR)

            qs = self.get_method(qs)(lookup)
        return qs


class TaskFilterSet(filters.FilterSet):
    contains = OrLookupFilter(lookup_dict={
        "title": "icontains",
        "description": "icontains",
    })

    completed = filters.BooleanFilter("completed")
    status = filters.ChoiceFilter(choices=TaskItem.TAKSITEM_STATUSES)
    priority = filters.ChoiceFilter(choices=TaskItem.TASKITEM_PRIORITIES)
    tags = filters.ModelMultipleChoiceFilter(
        field_name="tags__slug",
        to_field_name="slug",
        queryset=Tag.objects.all()
    )

    class Meta:
        model = TaskItem
        fields = ["contains", "completed", "status", "priority", "tags",
                  "completed_date", "owner", "start_date", "end_date", "for_today"]

