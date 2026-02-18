from django.urls import re_path
from .consumers import WhiteboardConsumer

websocket_urlpatterns = [
    re_path(r'^ws/whiteboard/(?P<room_name>\w+)/$', WhiteboardConsumer.as_asgi()),
]
