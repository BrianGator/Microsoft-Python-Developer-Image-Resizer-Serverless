# system_telemetry_reporter.py
# Written by Brian McCarthy
# Automated Python script to gather host hardware details, operating system properties, and memory allocation.

import os
import platform
import sys
import shutil
from datetime import datetime

def package_system_telemetry():
    """
    Retrieves core diagnostic details on Windows and Unix platforms and wraps them into structured reports.
    """
    print("==================================================================")
    print("  AUTOMATED HARDWARE & PLATFORM TELEMETRY LOGGER")
    print("  Author: Written by Brian McCarthy")
    print("==================================================================")
    
    # Retrieve system properties safely
    os_name = platform.system()
    os_release = platform.release()
    os_version = platform.version()
    architecture = platform.machine()
    processor_type = platform.processor() or "Generic Processor"
    python_ver = platform.python_version()
    
    # Storage details using shutil module
    try:
        total, used, free = shutil.disk_usage("/")
        total_gb = total / (1024 ** 3)
        used_gb = used / (1024 ** 3)
        free_gb = free / (1024 ** 3)
        disk_utilization = (used / total) * 100
    except Exception:
        total_gb = used_gb = free_gb = disk_utilization = 0

    print(f"[TIMESTAMP] Check evaluated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"[METRIC] OS Family         : {os_name}")
    print(f"[METRIC] OS Release Version: {os_release}")
    print(f"[METRIC] Architecture Type : {architecture}")
    print(f"[METRIC] Host Device Name  : {platform.node()}")
    print(f"[METRIC] Cpu Model Chip    : {processor_type}")
    print(f"[METRIC] Python Version    : {python_ver}")
    print(f"[METRIC] Primary Partition : Total: {total_gb:.1f}GB | Free: {free_gb:.1f}GB")
    print(f"[METRIC] Storage Usage Pct : {disk_utilization:.2f}% utilization")
    
    # Assess virtual runtime indicators
    is_sandboxed = os.path.exists('/.dockerenv') or os.path.exists('/proc/self/cgroup')
    print(f"[STATIC] Sandbox container  : {'Detected Container' if is_sandboxed else 'Standard Physical Node'}")
    
    # Write summary log block
    log_name = f"telemetry_report_node.log"
    try:
        with open(log_name, "w") as report_file:
            report_file.write("====================================================\n")
            report_file.write("  IT ADMIN TELEMETRY REPORT\n")
            report_file.write(f"  Author: Written by Brian McCarthy\n")
            report_file.write(f"  Generated On: {datetime.now().isoformat()}\n")
            report_file.write("====================================================\n")
            report_file.write(f"Platform family       : {os_name}\n")
            report_file.write(f"Build release         : {os_release} ({os_version})\n")
            report_file.write(f"Node execution context: {platform.node()}\n")
            report_file.write(f"Python build runtime  : {python_ver}\n")
            report_file.write(f"System Drive Partition: {total_gb:.1f} GB Total | {free_gb:.1f} GB Free\n")
            report_file.write("========================= END ======================\n")
        print(f"\n[SUCCESS] Outfield operational log generated successfully: '{log_name}'")
    except Exception as e:
         print(f"[ERROR] Failed to save local file reports: {e}", file=sys.stderr)

if __name__ == "__main__":
    package_system_telemetry()
