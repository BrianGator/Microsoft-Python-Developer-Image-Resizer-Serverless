# bulk_image_compressor.py
# Written by Brian McCarthy
# Python automation script for bulk compression of images under a local directory using multi-threading.

import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

def compress_single_image(file_path, output_dir, target_width=800, target_height=600, quality=85):
    """
    Compresses and resizes a single image using Pillow.
    """
    try:
        filename = os.path.basename(file_path)
        output_path = os.path.join(output_dir, filename)

        # Open image from direct file path
        with Image.open(file_path) as img:
            # Maintain aspect ratio or resize to standard dimensions
            img.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Save using web-optimized compression parameters
            img.save(output_path, format="JPEG", optimize=True, quality=quality)
            
            orig_size = os.path.getsize(file_path)
            new_size = os.path.getsize(output_path)
            savings = ((orig_size - new_size) / orig_size) * 100 if orig_size > 0 else 0
            
            print(f"[SUCCESS] Optimized: {filename} -> {new_size/1024:.1f}KB (-{savings:.1f}%)")
            return orig_size, new_size
    except Exception as e:
        print(f"[ERROR] Failed to optimize {file_path}: {e}", file=sys.stderr)
        return 0, 0

def bulk_optimize_directory(source_dir, output_dir, max_workers=4):
    """
    Scans source directory and spawns parallel threads to process images concurrently.
    """
    print("==================================================================")
    print("  PYTHON BULK IMAGE SCALE & OPTIMIZATION WORKFLOW")
    print("  Author: Written by Brian McCarthy")
    print("==================================================================")
    
    if not os.path.exists(source_dir):
        print(f"[FATAL] Source directory '{source_dir}' does not exist.")
        return

    os.makedirs(output_dir, exist_ok=True)
    
    # Supported image extensions
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.webp')
    image_files = []
    
    for root, _, files in os.walk(source_dir):
        for f in files:
            if f.lower().endswith(valid_extensions):
                image_files.append(os.path.join(root, f))
                
    if not image_files:
        print("[INFO] No compatible image files located in directories.")
        return

    print(f"[INFO] Discovered {len(image_files)} images for processing. Launching ThreadPool with {max_workers} threads...")
    start_time = time.time()
    
    total_original = 0
    total_compressed = 0
    
    # Launch concurrent workers to maximize multithreaded processor performance
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(compress_single_image, path, output_dir) 
            for path in image_files
        ]
        
        for future in futures:
            orig, comp = future.result()
            total_original += orig
            total_compressed += comp

    duration = time.time() - start_time
    saved_bytes = total_original - total_compressed
    savings_pct = (saved_bytes / total_original) * 100 if total_original > 0 else 0
    
    print("\n========================= JOB SUMMARIES =========================")
    print(f"Total Time Taken     : {duration:.2f} seconds")
    print(f"Original Data Weight : {total_original / (1024*1024):.2f} MB")
    print(f"Compressed Data Weight: {total_compressed / (1024*1024):.2f} MB")
    print(f"Footprint Slashed     : {savings_pct:.1f}% ({saved_bytes / (1024*1024):.2f} MB saved)")
    print("==================================================================")

if __name__ == "__main__":
    # Standard source & output configuration points
    source_folder = "./unoptimized_photos"
    dest_folder = "./optimized_output"
    
    # Generate mock folders for playground environments if running standalone
    if not os.path.exists(source_folder):
        os.makedirs(source_folder, exist_ok=True)
        print(f"[PLAYGROUND] Created mock directory '{source_folder}'. Place your raw camera photos here and execute again.")
    else:
        bulk_optimize_directory(source_folder, dest_folder)
