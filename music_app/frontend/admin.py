from django.contrib import admin
from api.models import *
from spotify.models import *

# Register your models here.

admin.site.register(Room)
admin.site.register(User)
admin.site.register(SpotifyToken)
admin.site.register(Vote)