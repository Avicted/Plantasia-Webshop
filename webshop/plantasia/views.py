from django.shortcuts import render
from datetime import datetime
from rest_framework import generics, status
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .serializers import ShopItemSerializer, CheckoutListSerializer, CheckoutItemSerializer, UserSerializer
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from rest_framework import authentication, permissions
from rest_framework import exceptions
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import ShopItem
from django.contrib.auth.models import User
from django.core.management import call_command
from django.http import Http404
from .permissions import IsSeller, ReadOnly
from rest_framework import filters
from rest_framework.decorators import action, permission_classes
from django.db.models import Q
from .forms import LandingPageForm
from django_filters import rest_framework as filters
import os
import base64


# Create your views here.
def index_view(request):
    return render(request,'index.html', context=None)

    
def landing_page_view(request):
    # Delete the db, repopulate from the fixture
    if request.method == 'POST':
        print(f'Resetting the data in the database to the mock data')

        # Nuke the database
        call_command('flush', verbosity=1, interactive=False)
        
        # Load initial data from a json file
        call_command('loaddata', 'fake_db_data.json', verbosity=1)

    context = {
        "form": LandingPageForm,
        "shopItemCount": ShopItem.objects.all().count(),
        "userCount": User.objects.all().count(),
    }

    return render(request, "landing_page.html", context)


class ShopItemList(generics.ListCreateAPIView):
    queryset = ShopItem.objects.filter(buyer__isnull=True).order_by('-created_at')
    
    pagination_class = PageNumberPagination
    permission_classes = (IsAuthenticatedOrReadOnly,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = ShopItemSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('name')


    def get(self, request, *args, **kwargs):
        permission_classes = (IsAuthenticatedOrReadOnly,)
        queryset = ShopItem.objects.filter(buyer__isnull=True).order_by('-created_at')

        # if the user is authenticated, do not return the items that the user is selling
        if self.request.user.is_authenticated:
            queryset = ShopItem.objects.filter(~Q(seller_id=self.request.user.id), buyer__isnull=True)
        
        # apply filtering
        name = self.request.query_params.get('name', None)
        print(f'get_queryset: name -> {name}')

        if name is not None:
            queryset = queryset.filter(name__contains=name)

        serializer = ShopItemSerializer(queryset, many=True, context={'request':request})

        try:
            page = self.paginate_queryset(serializer.data)
        except NotFound:
            error_response = {
                'errors': 'Page with shop items not found.',
                'status': 'error',
                'code': status.HTTP_404_NOT_FOUND,
                'data': []
            }

            return Response(error_response, status=status.HTTP_404_NOT_FOUND) 
            
        return self.get_paginated_response(page)


    def post(self, request):
        serializer = ShopItemSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(seller=self.request.user)

            response = {
                'status': 'success',
                'code': status.HTTP_201_CREATED,
                'message': 'Item successfully created!',
                'data': []
            }

            return Response(response)
        
        error_response = {
            'errors': serializer.errors,
            'status': 'error',
            'code': status.HTTP_400_BAD_REQUEST,
            'message': 'An error has occurred',
            'data': []
        }

        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)



class ShopItemDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        if item.seller_id != request.user.id:
            error_response = {
                'error': 'You are not the seller of this item',
                'status': 'error',
                'code': status.HTTP_401_UNAUTHORIZED,
                'data': []
            }
            return Response(error_response, status=status.HTTP_401_UNAUTHORIZED)

        response = {
            'status': 'success',
            'code': status.HTTP_204_NO_CONTENT,
            'message': 'Item successfully deleted!',
            'data': []
        }

        instance = self.get_object()
        self.perform_destroy(instance)

        return Response(response)


    # Partially update a shop item
    def patch(self, request, pk):
        print("===================================================")
        print(request.data)

        try:
            instance = ShopItem.objects.get(pk=pk)
        except ShopItem.DoesNotExist:
            error_response = {
                'error': 'Shop item not found',
                'status': 'error',
                'code': status.HTTP_404_NOT_FOUND,
                'data': []
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

        if instance.seller_id != request.user.id:
            error_response = {
                'error': 'You are not the seller of this item',
                'status': 'error',
                'code': status.HTTP_401_UNAUTHORIZED,
                'data': []
            }
            return Response(error_response, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ShopItemSerializer(instance, data=request.data, partial=True)

        print(instance)
        print(f'serializer.is_valid(): {serializer.is_valid()}')

        if serializer.is_valid():
            serializer.save(id=pk, data=serializer.validated_data)

            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Item successfully updated!',
                'data': []
            }

            return Response(response)
        
        error_response = {
            'errors': serializer.errors,
            'status': 'error',
            'code': status.HTTP_400_BAD_REQUEST,
            'message': 'An error has occurred',
            'data': []
        }

        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    

class MyItemsForSale(generics.ListAPIView):
    permission_classes = (IsSeller, IsAuthenticated)
    queryset = ShopItem.objects.order_by('-created_at')

    def get(self, request):
        queryset = ShopItem.objects.filter(buyer__isnull=True, seller=request.user.id).order_by('-created_at')
        serializer = ShopItemSerializer(queryset, many=True, context={'request':request})
        page = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(page)

        print(queryset)


class MySoldItems(generics.ListAPIView):
    permission_classes = (IsSeller, IsAuthenticated,)

    def get(self, request):
        queryset = ShopItem.objects.filter(seller=request.user.id, buyer__isnull=False).order_by('-created_at')
        serializer = ShopItemSerializer(queryset, many=True, context={'request':request})
        page = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(page)

        print(queryset)


class MyPurchasedItems(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        queryset = ShopItem.objects.filter(buyer=request.user.id).order_by('-created_at')
        serializer = ShopItemSerializer(queryset, many=True, context={'request':request})
        page = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(page)

        print(queryset)
 

class CheckoutView(generics.CreateAPIView):
    queryset = ShopItem.objects.all()
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        is_list = isinstance(request.data['items'], list)

        print(f"request.data['items']: {request.data['items']}")

        if not is_list:
            error_response = {
                'error': 'The items need to be in a list',
                'status': 'error',
                'code': status.HTTP_400_BAD_REQUEST,
                'data': []
            }

            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = CheckoutListSerializer(
                child=CheckoutItemSerializer(), 
                data=request.data['items'], 
                allow_empty=False,
                context={'request':request }
            )

            if serializer.is_valid():
                print(f'serializer.validated_data: {serializer.validated_data}')
                serializer.save(data=serializer.validated_data)

                success_response = {
                    'status': 'success',
                    'message': 'The checkout was successful',
                    'code': status.HTTP_200_OK,
                    'data': serializer.validated_data
                }
                return Response(success_response, status=status.HTTP_200_OK)

            error_response = {
                'code': serializer.errors['code'][0],
                'error': serializer.errors['error'][0],
                'items_with_price_updates': serializer.errors['items_with_price_updates'],
                'items_no_longer_available': serializer.errors['items_no_longer_available'],
            }

        # Return whatever error_response is set to
        return Response(error_response, status=int(serializer.errors['code'][0]))
