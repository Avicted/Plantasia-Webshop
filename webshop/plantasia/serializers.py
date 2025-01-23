from django.contrib.auth.models import User
from rest_framework import serializers, pagination
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import ShopItem
from .forms import CreateShopItemForm
from rest_framework.response import Response
from .utils import send_email_to_buyer, send_email_to_seller
import pprint
import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ShopItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        """
        Create and return a new `ShopItem` instance, given the validated data.
        """
        return ShopItem.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `ShopItem` instance, given the validated data.
        """
        if validated_data.get('price', validated_data['price']) < 1:
            error_response = {
                'error': "The price must be positive and a minimum of 1",
                'status': 'error',
                'code': status.HTTP_400_BAD_REQUEST,
                'data': []
            }
            raise serializers.ValidationError(error_response)

        instance.price = validated_data.get('price', validated_data['price'])

        # @Note(Victor): Due to requirement number 14, we only allow the user to update the price field.
        # instance.name = validated_data.get('name', instance.name)
        # instance.id = validated_data.get('id', instance.id)
        # instance.seller_id = validated_data.get('seller_id', instance.seller_id)
        # instance.buyer_id = validated_data.get('buyer_id', instance.buyer_id)
        # instance.name = validated_data.get('name', instance.name)
        # instance.description = validated_data.get('description', instance.description)
        # instance.image_src = validated_data.get('image_src', instance.image_src)
        # instance.image_alt = validated_data.get('image_alt', instance.image_alt)
        # instance.created_at = validated_data.get('created_at', instance.created_at)
        # instance.updated_at = validated_data.get('updated_at', instance.updated_at)


        instance.save()
        return validated_data

        # return instance.partial_update(instance, *args, **kwargs)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        return ret

    class Meta:
        validator = [CreateShopItemForm]
        model = ShopItem
        ordering = ['-created_at']
        depth = 1
        fields = (
            "id",
            "seller",
            "seller_id",
            "buyer_id",
            "name",
            "description",
            "price",
            "image_src",
            "image_alt",
            "created_at",
            "updated_at"
        )


# A single item that the user wants to purchase
class CheckoutItemSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = ShopItem
        fields = (
            'id', 
            'price'
        )
        extra_kwargs = {'id': {'required': True}, 'price': {'required': True}} 

# Multiple items that the user wants to purchase
class CheckoutListSerializer(serializers.ListSerializer):
    items = CheckoutItemSerializer(many=True)

    # handle the purchase of items
    def create(self, validated_data):
        """
        Create and return a the shopping basket items,  given the validated data.
        """
        print(f'============================================================')
        print(f' this is where we would update the items as sold in the db')
        print(f'validated_data.[0]["data"]: {validated_data[0]["data"]}')

        items_purchased = []

        for index in range(len(validated_data[0]["data"])):
            item = validated_data[0]["data"][index]
            id = item["id"]
            price = item["price"]

            print(f'price: {id}')
            print(f'id:    {price}')

            # Fetch the entity from the database by id
            entity = ShopItem.objects.get(pk=id)

            print(f'self.context["request"].user: {self.context["request"].user}')

            # Update the buyer of the item
            ShopItem.objects.filter(pk=id).update(buyer=self.context["request"].user)

            # get the entity again
            entity = ShopItem.objects.get(pk=id)
            items_purchased.append(entity)

            # Send email to the seller of the current item
            seller = User.objects.filter(pk=entity.seller_id).first()
            send_email_to_seller(seller.email, items_purchased)

        # Send email to the buyer
        send_email_to_buyer(self.context["request"].user.email, items_purchased)

        # print(f'self.get_object(): {self.get_object()}')
        print(f'============================================================')

        return validated_data
        # return ShopItem.objects.create(**validated_data)

    def validate(self, data): 
        print(f'\nCheckoutSerializer:')
        print(self)
        print(self.context['request'])
        print(data)


        # Typescript interface: CheckoutErrorResponse
        # error: string
        # items_with_price_updates: {
        #     id: string
        #     old_price: number
        #     new_price: number
        # }[]
        # items_no_longer_available: { id: string }[]
       
        print(f'CheckoutListSerializer: validate\n')
        for index in range(len(self.context['request'].data['items'])):
            item = self.context['request'].data['items'][index]

            # data to work with, comming from the user
            id = item["id"]
            price = item["price"]

            # Print debug info about the shopping basket contents
            print("Items in the shopping cart:")
            print(f'item: {item}')
            print(f'    -> id:    {id}')
            print(f'    -> price: {price}')
            print(f'')
            
            try:
                entity = ShopItem.objects.get(pk=id)
            except DoesNotExist:
                raise serializers.ValidationError(detail={
                    'code': status.HTTP_404_NOT_FOUND,
                    'error': 'The item you are trying to buy could not be found.',
                    'items_with_price_updates': [],
                    'items_no_longer_available': [
                        { 'id': id }
                    ]
                })

            # Check if the item is still available for sale? e.g.
            # is the buyer field still None?
            if entity.buyer is not None:
                raise serializers.ValidationError(detail={
                    'code': status.HTTP_404_NOT_FOUND,
                    'error': 'The item you are trying to buy has already been sold.',
                    'items_with_price_updates': [],
                    'items_no_longer_available': [
                        { 'id': id }
                    ]
                })
            
            # Check if the price has changed?
            if int(entity.price) != int(price):
                print(f'entity.price: {entity.price}\tprice: {price}')

                raise serializers.ValidationError(detail={
                    'code': status.HTTP_422_UNPROCESSABLE_ENTITY,
                    'error': f'The price of the item you are trying to buy has change from {price} to {entity.price}.',
                    'items_with_price_updates': [
                        { 
                            'id': id,
                            'old_price': int(price),
                            'new_price': int(entity.price),
                        },
                    ],
                    'items_no_longer_available': []
                })

        return self.context['request'].data['items']