from django.conf.urls import patterns, include, url

from django.contrib import admin
from rest_framework.routers import DefaultRouter
from organize.views import TaskItemViewSet, TaskList, TaskCreate

admin.autodiscover()

router = DefaultRouter()
router.register(r'tasks', TaskItemViewSet)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'organizer.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^list/$', TaskList.as_view(), {}, "task_list"),
    url(r'^create/$', TaskCreate.as_view(), {}, "task_create"),
    url(r'^$', TaskList.as_view(), {}, "index"),

    # url(r'^api/task/list/$', TaskListAPI.as_view(), name="task_list_api"),
    # url(r'^api/task/(?P<pk>\d+)/$', TaskItemAPI.as_view(), name="task_item_api"),
    url(r'^api/', include(router.urls))
)
