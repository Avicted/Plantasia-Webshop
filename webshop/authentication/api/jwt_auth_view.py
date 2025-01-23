import jwt, sys
from uuid import uuid4
from datetime import timedelta
from jwt.exceptions import PyJWTError
from django.contrib.auth import authenticate
from django.utils import timezone
from .serializers import MyTokenObtainPairSerializer
from rest_framework import HTTP_HEADER_ENCODING, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

SECRET_KEY = 'django-insecure-%fg0o6+b8&f$%t)l^k4l_w3zrp$mj1pk2*e6_y12zed^&!2$mb'

class MyJWTTokenAuthAPI(APIView):
    """
    Require a valid JWT to make a GET request
    """
    def get(self, request):
        # extract the claims from the token
        claims = self.authenticate(request)

        # If the token is ill-formatted.
        if not claims:
            msg = 'Invalid token.'
            raise AuthenticationFailed(msg)

        print(f'claims: {claims}')

        return Response(f"user_id: {claims['user_id']} is using my JWT Token Authentication.")

    def authenticate(self, request):
        """
        Returns a payload which is composed of different claims, if a valid token have been provided
        using JWT Token authentication.  Otherwise returns `None`.
        """

        # Get the information from the Authorization header (e.g., "Bearer access.token.123")
        auth = request.META.get('HTTP_AUTHORIZATION', b'')

        if isinstance(auth, str):
            # Work around django test client oddness
            auth = auth.encode(HTTP_HEADER_ENCODING)

        # Split the string to get: ["Bearer", "access.token.123"]
        auth = auth.split()

        # Check if the user asked for Token Authorization
        if not auth or auth[0].lower() != b'bearer':
            return None

            error_response = {
                'status': 'error',
                'error': '',
                'code': status.HTTP_401_UNAUTHORIZED,
                'data': []
            }

        # Check if the header is formatted correctly
        if len(auth) == 1:
            error_response.error = 'Invalid basic header. No credentials provided.'
            raise AuthenticationFailed(error_response)
        elif len(auth) > 2:
            error_response.error = 'Invalid basic header. Credentials string should not contain spaces.'
            raise AuthenticationFailed(error_response)

        # Decode the header to get the username and the password
        try:
            payload = jwt.decode([1], SECRET_KEY, algorithms='HS256')
            print(f'[MyJWTTokenAuthAPI] authenticate -> payload: {payload}\n')
        except (PyJWTError):
            error_response.error = 'Invalid token.'
            raise AuthenticationFailed(error_response)

        return payload


class MyDataView(APIView):
    """
    Return user data + access token against a valid Authorization header
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        print(f'request:\n')
        print(request.__dict__, file=sys.stderr)

        user = self.request.user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Data successfully obtained',
            'data': {
                'id': user.id,
                'username': user.get_username(),
                'email': user.email,
                'accessToken': str(access_token),
                'refreshToken': str(refresh),
            }
        })
    


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Return user data + access token against username/password.
    """
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request):
        user = self.authenticate(request)
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Tokens successfully obtained',
            'data': {
                'id': user.id,
                'username': user.get_username(),
                'email': user.email,
                'accessToken': str(access_token),
                'refreshToken': str(refresh),
            }
        })

    def authenticate(self, request):
        # Returns a `User` object if a correct username and password have been supplied
        # via JSON; otherwise, returns `None`.
        userid = request.data.get("username", "")
        password = request.data.get("password", "")

        user = authenticate(username=userid, password=password)

        if user is None:
            # raise AuthenticationFailed('Invalid username/password.')
            error_response = {
                'error': 'Invalid username or password.',
                'status': 'error',
                'code': status.HTTP_401_UNAUTHORIZED,
                'data': []
            }

            # return Response(error_response)
            raise AuthenticationFailed(error_response)

        if not user.is_active:
            error_response.error = 'User inactive or deleted.'
            raise AuthenticationFailed(error_response)

        
        return user