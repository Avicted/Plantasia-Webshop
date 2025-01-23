"""webshop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import include, url
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView
from plantasia.views import *

urlpatterns = [
    path('admin/', admin.site.urls),

    # Frontend routes
    # a. Shop  “/shop”
    # b. SignUp “/signup”
    # c. Login “/login”
    # d. Edit Account “/account”
    # e. MyItems: “/myitems”
    # f. Checkout: “/checkout

    # Static landing page
    path('', landing_page_view),

    # Include REST API endpoints
    path('api/', include('plantasia.urls')),
    path('api/auth/', include('authentication.api.urls')),

    # Static images -> use CDN in real world
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT,}),

    # Serve the react app
    path('shop/', TemplateView.as_view(template_name='index.html')),
    path('signup/', TemplateView.as_view(template_name='index.html')),
    path('login/', TemplateView.as_view(template_name='index.html')),
    path('account/', TemplateView.as_view(template_name='index.html')),
    path('myitems/', TemplateView.as_view(template_name='index.html')),
]
