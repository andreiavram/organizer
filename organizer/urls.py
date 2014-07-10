from django.conf.urls import patterns, include, url

from django.contrib import admin
from organize.views import TaskList, TaskCreate

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'organizer.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^list/$', TaskList.as_view(), {}, "task_list"),
    url(r'^create/$', TaskCreate.as_view(), {}, "task_create"),
    url(r'^$', TaskList.as_view(), {}, "index"),
)
