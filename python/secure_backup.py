# secure_backup.py
# Written by Brian McCarthy
# Automated script to perform secure zip archives of corporate file systems with logging telemetry.

import os
import sys
import shutil
import time
from datetime import datetime

def archive_production_vault(source_directory, archive_destination, format_type='zip'):
    """
    Constructs high-performance zipped system archives and registers logs.
    """
    print("==================================================================")
    print("  AUTOMATED PRODUCTION DATA ARCHIVE & COMPRESSION SYSTEM")
    print("  Author: Written by Brian McCarthy")
    print("==================================================================")
    print(f"[START] Inspecting source path structure: {source_directory}")
    
    if not os.path.exists(source_directory):
        print(f"[ABORT] Target source '{source_directory}' cannot be resolved.")
        return False
        
    os.makedirs(os.path.dirname(archive_destination) or '.', exist_ok=True)
    
    try:
        start_time = time.time()
        print(f"[ARCHIVE] Packaging folders recursively to format: {format_type}...")
        
        # Build compression blocks
        output_filepath = shutil.make_archive(
            base_name=archive_destination,
            format=format_type,
            root_dir=source_directory
        )
        
        elapsed = time.time() - start_time
        archive_size = os.path.getsize(output_filepath)
        
        print("\n======================= EXPORT TELEMETRY =======================")
        print(f"Completion Date : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Archive Output  : {os.path.abspath(output_filepath)}")
        print(f"Block Weight    : {archive_size / (1024*1024):.2f} MB")
        print(f"System Latency  : {elapsed:.2f} seconds")
        print("=================================================================")
        return True
    except PermissionError:
        print("[FATAL ERROR] High-privilege access key required on destination routes.", file=sys.stderr)
        return False
    except Exception as e:
        print(f"[FATAL ERROR] Packing routine broken: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Standard backup directories
    local_source = "./unoptimized_photos"
    vault_export = "./backup_vault/nightly_photo_backup"
    
    # Create source directory if running standalone on target terminals
    os.makedirs(local_source, exist_ok=True)
    archive_production_vault(local_source, vault_export)
