from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from whiteboard.views import join_room

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/join-room/', join_room),
    path('', TemplateView.as_view(template_name='index.html')),
]
