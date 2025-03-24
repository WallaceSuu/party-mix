from django.shortcuts import render
from rest_framework import generics, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        username = request.data.get("username") 

        if code != None:
            room_rslt = Room.objects.filter(code=code)
            if len(room_rslt)>0:
                room = room_rslt[0]
                self.request.session['room_code'] = code

                user_session_key = self.request.session.session_key
                user = User.objects.filter(user=user_session_key).first()

                if user:
                    user.room = room
                    user.save()
                else:
                    user = User.objects.create(username=username,
                                        user=user_session_key,
                                        created_at="date",
                                        host=False,
                                        room=room
                                        )

                    user_data = AddUserSerializer(user).data

                    return Response({"Message: ": "Room joined!", "user" : user_data}, status=status.HTTP_200_OK)

            return Response({"Bad Request: ": "Invalid room code"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetUsersInRoom(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get("room_code")
        users = User.objects.filter(room__code=room_code)  # Adjust query based on your models
        serializer = AddUserSerializer(users, many=True)
        return Response(serializer.data)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                self.request.session['room_code'] = room.code
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        
        return Response({"Bad Request":"Invalid data..."}, stauts=status.HTTP_400_BAD_REQUEST)
    
class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room)>0:
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({"Room Not Found": "Invalid room code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad Request": "Code parameter not found"}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            "code": self.request.session.get("room_code")
        }

        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            user_results = User.objects.filter(user=host_id)
            
            if len(user_results)>0:
                user = user_results[0]
                user.delete()

            if len(room_results)>0:
                room = room_results[0]
                room.delete()

        return Response({"Message": "Success"}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializerClass = UpdateRoomSerializer
    
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializerClass(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if len(queryset)==0:
                return Response({"Msg":"Room doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({"Msg":"You are not the host of this room"}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({"Bad Request":"Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)