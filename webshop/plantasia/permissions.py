from rest_framework.permissions import SAFE_METHODS, BasePermission
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import exceptions
from .models import ShopItem


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsSeller(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        print("class IsSeller")
        print(request)

        # is the user the buyer of this item id?
        if request.method == 'PATCH':
            if self.user.id == obj.buyer_id:
                return True
            else:
                return False

        return False
