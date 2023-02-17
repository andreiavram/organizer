from django.urls import path, include

from django.contrib import admin
from rest_framework.routers import DefaultRouter
from tasks.views import TaskItemViewSet, MainAppView, TagViewSet, ProjectViewSet, TaskCommentViewSet

admin.autodiscover()

router = DefaultRouter()
router.register(r'task', TaskItemViewSet)
router.register(r'tag', TagViewSet)
router.register(r'project', ProjectViewSet)
router.register(r'comments', TaskCommentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', MainAppView.as_view(), {}, "index"),
    path('api/', include(router.urls)),
    path('rest-auth/', include('dj_rest_auth.urls')),
]
