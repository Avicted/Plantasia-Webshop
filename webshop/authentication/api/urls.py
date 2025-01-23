from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from authentication.api import views, jwt_auth_view, basic_auth_view

urlpatterns = [
    # Register a new user
    path('register/', views.UserRegistration.as_view(), name="register_user"),

    # Change the password of a user
    path('change-password/', views.ChangePasswordView.as_view(), name="change_password"),

    # Returns a user object with some extra fields
    path('token/', jwt_auth_view.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Returns a new access token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Returns the same as token/
    path('me/', jwt_auth_view.MyDataView.as_view(), name='me'),
]
