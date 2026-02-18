from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Room
from asgiref.sync import sync_to_async

class WhiteboardConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.access_code = self.scope['query_string'].decode().split("=")[-1]

        room_exists = await self.validate_room()

        if not room_exists:
            await self.close()
            return

        self.room_group_name = f'room_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    @sync_to_async
    def validate_room(self):
        try:
            room = Room.objects.get(name=self.room_name)
            return room.access_code == self.access_code
        except Room.DoesNotExist:
            return False

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': text_data
            }
        )

    async def broadcast_message(self, event):
        await self.send(text_data=event['message'])
