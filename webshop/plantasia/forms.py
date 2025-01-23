from django import forms

class LandingPageForm(forms.Form):
    reset_data = forms.CharField(label='reset_data')


class CreateShopItemForm(forms.Form):
    name = forms.CharField(max_length=64, required=True)
    description = forms.CharField(max_length=256, required=True)
    price = forms.IntegerField(required=True)
    image_src = forms.FileField(required=False)

# @Note(Victor): Requirement 14. only the price can be updated on an existing item for sale
class UpdateShopItemForm(forms.Form):
    price = forms.IntegerField(required=True, min_value=1)
    # name = forms.CharField(max_length=64, required=True)
    # description = forms.CharField(max_length=256, required=True)
    # image_src = forms.FileField(required=False)
