from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='music_app\spotify\.env')

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# Create your views here.

class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        url = Request("GET", "https://accounts.spotify.com/authorize", params={
            "scope": scopes,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
        }).prepare().url

        return Response({"url": url}, status=status.HTTP_200_OK)
    
def spotify_callback(request, format=None):
    code = request.GET.get("code")
    error = request.GET.get("error")
    
    response = post("https://accounts.spotify.com/api/token", data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    error = response.get("error")
    
    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    return redirect("frontend:")

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({"status":"Is authenticated"}, status=status.HTTP_200_OK)
    
