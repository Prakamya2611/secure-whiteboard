from django.db import models
import uuid

class Room(models.Model):
    name = models.CharField(max_length=100, unique=True)
    access_code = models.CharField(max_length=8, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.access_code:
            self.access_code = uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
