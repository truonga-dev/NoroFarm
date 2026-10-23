from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class ResponseModel(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    message: Optional[str] = None
    errors: Optional[Any] = None
    meta: Optional[Any] = None

def success_response(data: T, message: str = "Success", meta: Optional[Any] = None) -> ResponseModel[T]:
    return ResponseModel(success=True, data=data, message=message, meta=meta)

def error_response(message: str, errors: Any = None) -> ResponseModel[None]:
    return ResponseModel(success=False, message=message, errors=errors)
