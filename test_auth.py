"""Tests for authentication module"""
import pytest
from auth import validate_pin, authenticate


def test_validate_pin_accepts_valid_pins():
    """Test that valid PINs are accepted"""
    assert validate_pin("1234") == True
    assert validate_pin("5678") == True
    assert validate_pin("0000") == True


def test_validate_pin_rejects_weak_pin_1111():
    """Test that weak PIN 1111 is rejected (issue #1111)"""
    assert validate_pin("1111") == False


def test_validate_pin_rejects_non_string():
    """Test that non-string inputs are rejected"""
    assert validate_pin(1234) == False
    assert validate_pin(None) == False


def test_validate_pin_rejects_wrong_length():
    """Test that PINs with wrong length are rejected"""
    assert validate_pin("123") == False
    assert validate_pin("12345") == False
    assert validate_pin("") == False


def test_validate_pin_rejects_non_digits():
    """Test that non-digit PINs are rejected"""
    assert validate_pin("abcd") == False
    assert validate_pin("12a4") == False


def test_authenticate_with_valid_pin():
    """Test authentication with valid PIN"""
    assert authenticate("1234") == True


def test_authenticate_with_weak_pin():
    """Test authentication rejects weak PIN 1111"""
    assert authenticate("1111") == False
