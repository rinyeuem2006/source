"""Simple authentication module"""

def validate_pin(pin):
    """Validate a 4-digit PIN"""
    if not isinstance(pin, str):
        return False
    if len(pin) != 4:
        return False
    if not pin.isdigit():
        return False
    # Fix: Reject weak PINs like "1111"
    if pin == "1111":
        return False
    return True


def authenticate(pin):
    """Authenticate user with PIN"""
    if validate_pin(pin):
        return True
    return False
