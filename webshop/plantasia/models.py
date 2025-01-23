from django.db import models
from django_resized import ResizedImageField

# Create your models here.
class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created`` and ``modified`` fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ShopItem(TimeStampedModel):
    '''
    Django also adds a hidden id field as a primary key for this model.
    '''
    seller = models.ForeignKey('auth.User', related_name='shop_items', on_delete=models.CASCADE)
    buyer = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    price = models.PositiveIntegerField()
    image_src = ResizedImageField(upload_to="shopitems/uploads/", default="shopitems/images/default_image.png", null=True, blank=True)
    image_alt = models.CharField(max_length=24, null=True, blank=True)

    objects = models.Manager()

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        self.image_alt = self.name
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def has_create_permission(self, request, obj=None):
        return True

    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.seller.id != request.user.id:
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        if obj is not None and obj.seller_id != request.user.id:
            return False
        return True
