from django.conf.urls import patterns, include, url

from django.contrib import admin
from rest_framework.routers import DefaultRouter
from organize.views import TaskItemViewSet, MainAppView, TagViewSet, ProjectViewSet, TaskCommentViewSet

admin.autodiscover()

router = DefaultRouter()
router.register(r'task', TaskItemViewSet)
router.register(r'tag', TagViewSet)
router.register(r'project', ProjectViewSet)
router.register(r'comments', TaskCommentViewSet)

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', MainAppView.as_view(), {}, "index"),

    url(r'^api/', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls'))
]
