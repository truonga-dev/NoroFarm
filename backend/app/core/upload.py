import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from pathlib import Path

# Thư mục lưu trữ tĩnh
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "doc", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

class UploadService:
    @staticmethod
    async def save_file(file: UploadFile, sub_folder: str = "") -> str:
        """Lưu file tải lên vào storage cục bộ"""
        ext = file.filename.split(".")[-1].lower() if file.filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Định dạng file không được hỗ trợ")

        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File quá lớn (Tối đa 10MB)")

        new_filename = f"{uuid.uuid4().hex}.{ext}"
        target_dir = UPLOAD_DIR / sub_folder
        target_dir.mkdir(parents=True, exist_ok=True)
        
        file_path = target_dir / new_filename

        async with aiofiles.open(file_path, 'wb') as out_file:
            while content := await file.read(1024 * 1024):  # 1MB chunks
                await out_file.write(content)

        # Trả về URL tương đối
        return f"/uploads/{sub_folder}/{new_filename}".replace("//", "/")
