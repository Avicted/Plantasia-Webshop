from django.urls import path
from . import views
from rest_framework import generics
from .serializers import ShopItemSerializer
from .models import ShopItem

urlpatterns = [
    path('shop-items/', views.ShopItemList.as_view()),
    path('shop-items/<int:pk>/', views.ShopItemDetails.as_view()),
    path('my-items-for-sale/', views.MyItemsForSale.as_view()),
    path('my-sold-items/', views.MySoldItems.as_view()),
    path('my-purchased-items/', views.MyPurchasedItems.as_view()),
    path('checkout/', views.CheckoutView.as_view()),
]