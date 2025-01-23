import base64
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed


class MyBasicAuthAPI(APIView):
    """
    HTTP Basic authentication against username/password.
    Based on the https://github.com/encode/django-rest-framework/blob/master/rest_framework/authentication.py
    """
    def get(self, request):
        self.authenticate(request)

        return Response("I have implemented my own Basic Authentication")

    def authenticate(self, request):
        """
        Returns a `User` if a correct username and password have been supplied
        using HTTP Basic authentication.  Otherwise returns `None`.
        """
 
        # Get the information from the Authorization header
        auth = request.META.get('HTTP_AUTHORIZATION', b'').split()

        # Check if the user asked for Basic Authorization
        if not auth or auth[0].lower() != b'basic':
            return None

        # Check if the header is formatted correctly
        if len(auth) == 1:
            msg = 'Invalid basic header. No credentials provided.'
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid basic header. Credentials string should not contain spaces.'
            raise AuthenticationFailed(msg)

        # Decode the header to get the username and the password
        try:
            auth_decoded = base64.b64decode(auth[1]).decode('utf-8')
            auth_parts = auth_decoded.partition(':')
        except (TypeError, UnicodeDecodeError):
            msg = 'Invalid basic header. Credentials not correctly base64 encoded.'
            raise AuthenticationFailed(msg)

        userid, password = auth_parts[0], auth_parts[2]
        return self.authenticate_credentials(userid, password, request)

    def authenticate_credentials(self, userid, password, request=None):
        """
        Authenticate the userid and password against username and password
        with optional request for context.
        """

        user = authenticate(username=userid, password=password)

        if user is None:
            raise AuthenticationFailed('Invalid username/password.')

        if not user.is_active:
            raise AuthenticationFailed('User inactive or deleted.')

        return user
