import asyncio
from typing import Callable, Coroutine
from app.core.logger import logger

class Scheduler:
    """
    Trình lên lịch chạy ngầm đơn giản (Simple Background Scheduler)
    Dùng để tự động cập nhật dữ liệu thời tiết định kỳ
    """
    def __init__(self):
        self.tasks = []
        self._is_running = False

    async def add_task(self, name: str, task_func: Callable[[], Coroutine], interval_seconds: int):
        """Thêm một tác vụ chạy lặp lại định kỳ"""
        self.tasks.append({
            "name": name,
            "func": task_func,
            "interval": interval_seconds
        })

    async def start(self):
        """Bắt đầu chạy tất cả các tác vụ"""
        self._is_running = True
        for task in self.tasks:
            asyncio.create_task(self._run_task(task))
            
    async def stop(self):
        """Dừng tất cả các tác vụ"""
        self._is_running = False

    async def _run_task(self, task: dict):
        """Hàm thực thi tác vụ lặp lại"""
        logger.info(f"Khởi động tác vụ: {task['name']}")
        while self._is_running:
            try:
                if task["name"] == "fetch_all_commodity_prices":
                    await asyncio.wait_for(task["func"](), timeout=120)
                else:
                    await task["func"]()
            except Exception as e:
                logger.error(f"Lỗi khi chạy tác vụ {task['name']}: {e}")
            await asyncio.sleep(task["interval"])

scheduler = Scheduler()
