"""Auto-cleanup service: deletes temp files older than TTL on a background thread."""
import threading
import time
import logging
from app.config import TEMP_DIR, CLEANUP_TTL_MINUTES, CLEANUP_INTERVAL_MINUTES

logger = logging.getLogger(__name__)


def cleanup_old_files():
      now = time.time()
      ttl = CLEANUP_TTL_MINUTES * 60
      deleted = 0
      if not TEMP_DIR.exists():
                return
            for item in TEMP_DIR.rglob("*"):
                      try:
                                    if item.is_file() and now - item.stat().st_mtime > ttl:
                                                      item.unlink()
                                                      deleted += 1
elif item.is_dir():
                try:
                                      item.rmdir()
except OSError:
                    pass
except Exception as e:
            logger.warning(f"Cleanup: could not remove {item}: {e}")
    if deleted:
              logger.info(f"Cleanup: removed {deleted} temp file(s)")


def _scheduler_loop():
      interval = CLEANUP_INTERVAL_MINUTES * 60
    while True:
              time.sleep(interval)
              try:
                            cleanup_old_files()
except Exception as e:
            logger.error(f"Cleanup error: {e}")


def start_cleanup_scheduler():
      t = threading.Thread(target=_scheduler_loop, daemon=True, name="cleanup-scheduler")
    t.start()
    logger.info(f"Cleanup scheduler started (interval={CLEANUP_INTERVAL_MINUTES}min, TTL={CLEANUP_TTL_MINUTES}min)")
