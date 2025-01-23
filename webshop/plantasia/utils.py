from django.core.mail import send_mail
from rest_framework import exceptions
import base64

def send_email_to_buyer(email, items):
    print(f'send_email_to_buyer {email}')

    message = """
    Thank you for your purchase at Plantasia. 
        
    You purchased the following items:
    """

    for i in range(len(items)):
        print(f'[send_email_to_buyer] item.name: {items[i].name}')
        message += "- " + items[i].name + "\n"

    message += """\n\n
    Best Regards,
    noreply@notasoftwaredevelopmentcompany.com
    """

    send_mail(
        'Purchase confirmation',

        message,

        'noreply@notasoftwaredevelopmentcompany.com',

        [email],

        fail_silently=False,
    )


def send_email_to_seller(email, items):
    print(f'send_email_to_seller {email}')

    message = """
    You have made sales at Plantasia!
        
    You have sold the following items:
    """

    for i in range(len(items)):
        print(f'[send_email_to_seller] item.name: {items[i].name}')
        message += "- " + items[i].name + "\n"

    message += """\n\n
    Best Regards,
    noreply@notasoftwaredevelopmentcompany.com
    """

    send_mail(
        'You have made sales at Plantasia!',

        message,

        'noreply@notasoftwaredevelopmentcompany.com',

        [email],

        fail_silently=False,
    )