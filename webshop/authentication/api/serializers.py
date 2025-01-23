from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    oldPassword = serializers.CharField(required=True)
    newPassword = serializers.CharField(required=True)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        user = User.objects.filter(pk=self.user.id).first()
        if user:
            data['user'] = user

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=48,
        required=True
    )
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        '''
        Check if the password1 and password2 are equal.
        '''
        if data['password1'] != data['password2']:
            error_response = {
                'error': "The two password fields didn't match.",
                'status': 'error',
                'code': status.HTTP_400_BAD_REQUEST,
                'data': []
            }
            raise serializers.ValidationError(error_response)
        return data

    def get_cleaned_data(self):
        '''
        Return data validated by the serializer
        '''
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        '''
        Create and return a User object based on validated data.
        '''
        cleaned_data = self.get_cleaned_data()
        try:
            user = User.objects.create_user(
                username=cleaned_data["username"],
                email=cleaned_data["email"],
                password=cleaned_data['password1']
            )
        except IntegrityError as e:
            if 'unique constraint' in str(e).lower():
                raise ValidationError({ "error": "User already exists with the same username." })
            else:
                raise ValidationError({ "error": "An error occurred. User was not created." })
        return user