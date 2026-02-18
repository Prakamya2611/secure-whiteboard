from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def join_room(request):
    if request.method == "POST":
        data = json.loads(request.body)
        room = data.get("room")
        access_code = data.get("accessCode")

        if room == "room1" and access_code == "1234":
            return JsonResponse({"message": "Success"})
        else:
            return JsonResponse({"error": "Invalid"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)
