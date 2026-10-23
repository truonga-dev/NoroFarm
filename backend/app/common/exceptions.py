from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class CustomException(Exception):
    """Base exception cho toàn bộ app."""
    def __init__(self, status_code: int = 400, message: str = "Lỗi không xác định"):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


from typing import Any

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler cho CustomException."""
    status_code = getattr(exc, "status_code", 400)
    message = getattr(exc, "message", str(exc))
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "errors": None,
        },
    )


async def validation_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler cho lỗi validation của Pydantic/FastAPI."""
    errors = []
    exc_errors = getattr(exc, "errors", lambda: [])() if hasattr(exc, "errors") else []
    for error in exc_errors:
        field = ".".join(str(loc) for loc in error.get("loc", []) if loc != "body")
        errors.append({"field": field, "message": error.get("msg", "")})

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Dữ liệu không hợp lệ",
            "data": None,
            "errors": errors,
        },
    )


async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler chuẩn hóa cho HTTPException của FastAPI, giữ đúng envelope ResponseModel."""
    status_code = getattr(exc, "status_code", 500)
    detail = getattr(exc, "detail", str(exc))
    message = detail if isinstance(detail, str) else "Yêu cầu không hợp lệ"
    errors = detail if not isinstance(detail, str) else None
    headers = getattr(exc, "headers", None) or {}

    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "errors": errors,
        },
        headers=headers,
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler cho mọi exception chưa được bắt để đảm bảo luôn trả về response JSON và giữ CORS headers."""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Đã xảy ra lỗi hệ thống nội bộ. Vui lòng thử lại sau.",
            "data": None,
            "errors": str(exc),
        },
    )
