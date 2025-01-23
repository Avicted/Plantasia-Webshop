from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from authentication.api.serializers import RegisterSerializer, UserSerializer

class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            error_response = {
                'error': 'Update password error',
                'status': 'error',
                'code': status.HTTP_400_BAD_REQUEST,
                'data': []
            }

            # Check old password
            if not self.object.check_password(serializer.data.get("oldPassword")):
                error_response['error'] = 'The current password given is wrong'
                return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("newPassword"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class UserRegistration(APIView):
    permission_classes = (AllowAny,)
    '''
    Create a new user based on user data provided via JSON payload
    '''

    def get_response_data(self, user):
        return UserSerializer(user).data

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save(request)

        return Response(
            self.get_response_data(user),
            status=status.HTTP_201_CREATED,
        )


