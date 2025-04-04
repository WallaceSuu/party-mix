from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credentials import CLIENT_SECRET, CLIENT_ID, REDIRECT_URI

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=["access_token", "refresh_token", "expires_in", "token_type"])
    else:
        tokens = SpotifyToken(user=session_key,
                                access_token=access_token,
                                refresh_token=refresh_token,
                                token_type=token_type,
                                expires_in=expires_in)
        tokens.save()
    
def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiration = tokens.expires_in
        if expiration <= timezone.now():
            renew_spotify_token(session_id)
        return True
    return False

def renew_spotify_token(session_id):
    current_tokens = get_user_tokens(session_id)
    old_refresh_token = current_tokens.refresh_token

    response = post("https://accounts.spotify.com/api/token", data={
        'grant_type': 'refresh_token',
        'refresh_token': old_refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    #print("Spotify API response:", response)

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in') or 3600 #in case it returns none in this field
    new_refresh_token = response.get('refresh_token') or old_refresh_token

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, new_refresh_token)

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    if tokens is None:
        return{"Error ": "User not authenticated with Spotify"}
    header = {"Content-Type": "application/json", "Authorization": "Bearer " + tokens.access_token}
    
    if post_:
        post(BASE_URL + endpoint, headers=header)
    if put_:
        put(BASE_URL + endpoint, headers=header)
    
    response = get(BASE_URL + endpoint, (), headers=header)
    try:
        return response.json()
    except:
        #print(response)
        return {"Error": "Issue with request"}
    
def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)

def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id, "player/next", post_=True)

def go_back(session_id):
    return execute_spotify_api_request(session_id, "player/previous", post_=True)