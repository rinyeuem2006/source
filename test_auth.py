"""Tests for authentication module"""
import pytest
from auth import validate_pin, authenticate


def test_validate_pin_accepts_valid_pins():
    """Test that valid PINs are accepted"""
    assert validate_pin("1234")
    assert validate_pin("5678")
    assert validate_pin("0000")


def test_validate_pin_rejects_weak_pin_1111():
    """Test that weak PIN 1111 is rejected (issue #1111)"""
    assert not validate_pin("1111")


def test_validate_pin_rejects_non_string():
    """Test that non-string inputs are rejected"""
    assert not validate_pin(1234)
    assert not validate_pin(None)


def test_validate_pin_rejects_wrong_length():
    """Test that PINs with wrong length are rejected"""
    assert not validate_pin("123")
    assert not validate_pin("12345")
    assert not validate_pin("")


def test_validate_pin_rejects_non_digits():
    """Test that non-digit PINs are rejected"""
    assert not validate_pin("abcd")
    assert not validate_pin("12a4")


def test_authenticate_with_valid_pin():
    """Test authentication with valid PIN"""
    assert authenticate("1234")


def test_authenticate_with_weak_pin():
    """Test authentication rejects weak PIN 1111"""
    assert not authenticate("1111")
