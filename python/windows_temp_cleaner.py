# windows_temp_cleaner.py
# Written by Brian McCarthy
# Automated directory purging utility targeting temporary Windows cache, logs, and expired assets.

import os
import sys
import time
from datetime import datetime

def purge_expired_cache(directories, age_threshold_days=7):
    """
    Scans specified directories and recursively purges files older than the specified day threshold.
    """
    print("==================================================================")
    print("  WINDOWS SYSTEM CACHE PURGE & IT AUTOMATION LAB")
    print("  Author: Written by Brian McCarthy")
    print("==================================================================")
    
    total_purged_files = 0
    total_reclaimed_space = 0
    cutoff_time = time.time() - (age_threshold_days * 86400) # days to seconds conversion
    
    print(f"[INFO] Scanning system paths for items older than {age_threshold_days} days...")
    
    for folder in directories:
        # Expand environment variables such as %TEMP% standard paths
        expanded_path = os.path.expandvars(folder)
        if not os.path.isdir(expanded_path):
            print(f"[SKIP] Directory '{expanded_path}' does not exist or isn't accessible.")
            continue
            
        print(f"[SCAN] Auditing directory: '{expanded_path}'")
        for root, dirs, files in os.walk(expanded_path):
            for filename in files:
                full_file_path = os.path.join(root, filename)
                try:
                    stats = os.stat(full_file_path)
                    # Assess modification file age parameters
                    if stats.st_mtime < cutoff_time:
                        file_sz = stats.st_size
                        os.remove(full_file_path)
                        total_purged_files += 1
                        total_reclaimed_space += file_sz
                        print(f"[DELETE] Cleared: {filename} ({file_sz/1024:.1f} KB)")
                except PermissionError:
                    # Ignore active locked files being used by operating system kernels
                    pass
                except Exception as e:
                    print(f"[WARNING] Skipping lock file '{filename}': {e}", file=sys.stderr)
                    
    reclaimed_mb = total_reclaimed_space / (1024 * 1024)
    print("\n======================= SYSTEM STATUS REPORT =======================")
    print(f"Purge Completion Time : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total Cached Files Purged : {total_purged_files}")
    print(f"Total Storage Reclaimed   : {reclaimed_mb:.2f} MB")
    print("====================================================================")

if __name__ == "__main__":
    # Standard temporary folder points common to local configurations or developer servers
    directories_to_audit = [
        r"C:\Windows\Temp",
        r"%TEMP%",
        r"./temp_dev_cache" # local playground mock folder
    ]
    
    # Create local playground folder to guarantee code executes seamlessly in safe sandbox
    local_mock = os.path.expandvars("./temp_dev_cache")
    if not os.path.exists(local_mock):
        os.makedirs(local_mock, exist_ok=True)
        # Create some old mock files to showcase deletion
        now = time.time()
        for i in range(5):
            mock_file = os.path.join(local_mock, f"stale_cache_block_{i}.log")
            with open(mock_file, "w") as f:
                f.write("MOCK STALE CACHE SEGMENT FOR TESTING" * 200)
            # Set modification time to 15 days ago
            os.utime(mock_file, (now - (15 * 86400), now - (15 * 86400)))
            
    purge_expired_cache(directories_to_audit, age_threshold_days=10)
