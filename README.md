# Microsoft Server Developer Project 
# Serverless Python Image Resizer Sandbox

An interactive learning platform, serverless sandbox, and virtual cloud simulation environment designed to demonstrate real-world Python automation utilizing Microsoft Azure Functions and Azure Blob Storage triggers.

**Author:** Written by Brian McCarthy

---

## 📌 Project Overview
- **Project Name:** Serverless Python Image Resizer
- **Website Name:** Serverless Python Image Resizer Sandbox
- **Core Creator:** Written by Brian McCarthy

---

## 💻 Languages Used
- **TypeScript:** Powers frontend logic, simulated streaming terminals, interactive progress states, sandbox configurations, and local metadata rendering.
- **Python:** Standard language for cloud scripting, utilizing Pillow (PIL) and Azure SDK modules in `main.py`.
- **HTML5:** Underlying document structure, frame headers, and vector integration nodes.
- **CSS3 with Tailwind CSS:** Responsive styling, optimized typography, scrollbar overrides, and visual theme modeling reflecting Azure portal layouts.

---

## 🛠️ Technologies Used
- **React 18:** Modern layout declarations, functional component architectures, and fast reactive states using React Hooks.
- **Vite:** High-performance application compiler and asset pipeline builder.
- **Tailwind CSS:** Comprehensive utility framework for responsive, high-contrast visual systems.
- **Motion React (Framer Motion):** Smooth visual entry cards, active loading spins, and step completion animations.
- **Lucide React:** Premium clean vector icons.

---

## 📈 Methodologies Used
- **Deterministic Compression Mathematics:** Dynamically simulates pixel-perfect calculations of high resolution files down to smaller dimensions, updating file storage ratios on-the-fly.
- **Event-Driven UI Actions:** Real-time state synchronization binds code configuration text blocks, file selection, and custom height/width numeric parameters.
- **Virtual Serverless Simulation:** Implements a full-stack mockup of a high-performance serverless cloud container. Emulates server warmups, streaming deployment logs, download bottlenecks, PIL Pillow manipulation, and Azure Storage bindings.
- **Accredited Developer Theme:** Integrates attribution tags acknowledging authorship clearly on every page view.

---

## 📁 Shared File Architecture
The sandbox is built from highly cohesive, split modules organizing frontend interactions, configuration structures, and production-grade Python automation scripts:

*   **`index.html`**: Host framing document holding the applet element hooks.
*   **`package.json`**: Setup manifest managing npm build assets, development dependencies, and system builders.
*   **`vite.config.ts`**: High-fidelity compiler parameters adjusting CSS bindings.
*   **`src/main.tsx`**: SPA entry initiator rendering components dynamically.
*   **`src/App.tsx`**: Dynamic central layout controller managing sandbox checklist sequences, optimization calculations, and master states.
*   **`src/types.ts`**: Central TypeScript types managing strict configurations for blobs, terminal outputs, and training checklists.
*   **`src/data.ts`**: Static database, placeholder vector image payloads, default code modules, and regex dimension parsers.
*   **`src/index.css`**: Configures custom scrollbars, typography pairings, and Azure-themed Portal color presets.
*   **`src/components/`**: Structured React component directory:
    *   **`GuideWalkthrough.tsx`**: Controls step guides, progress calculation sliders, and Target Areas.
    *   **`CodeWorkspace.tsx`**: Features an interactive Python coding board, dimension adjustments, and mock Azure connection string keys.
    *   **`StorageExplorer.tsx`**: Features a fully virtualized file explorer allowing custom uploads, preset creations, file-by-file property details, and block deletions.
    *   **`SimulatorConsole.tsx`**: Features high-fidelity logs of Python serverless containers launching, reading blobs, applying PIL operations, and saving buffers.
*   **`python/` / Root Scripts (The Python Showcase Scripts)**:
    *   **`python/bulk_image_compressor.py`**: A fully functional, multithreaded image compression script designed to parse, resize, and store optimized local media folders concurrently.
    *   **`python/windows_temp_cleaner.py`**: Automated server cleanup utility designed for IT system administrators, deleting expired log files and cleaning up system folders safely based on time thresholds.
    *   **`python/windows_service_watchdog.py`**: Automatic Windows system service checking loop that monitors database and server instances in real-time, restarting them if a failure or crash occurs.
    *   **`python/rest_api_assertion.py`**: Advanced QA testing script designed to perform automated GET/POST assertions, testing schema parameters, and ensuring payload response speeds meet performance SLAs.
    *   **`python/system_telemetry_reporter.py`**: Diagnostics gathering log script which retrieves core system build releases, memory partition limits, storage ratios, and packages findings into standalone log documents.
    *   **`python/selenium_e2e_tester.py`**: Standardized testing pipeline utilizing Selenium browser controllers to launch, click, and assert complex UI forms on deployed servers.
    *   **`python/secure_backup.py`**: Robust backup compression utility designed to package and archive production-ready server paths securely into compressed zip blocks.

---

## 🕹️ Interactive Guide & How to Use
1.  **Step 1:** Select a high-resolution preset photo in **STEP 4** (e.g. Sunset Mountains, Cyberpunk Alley) to establish an initial uncompressed benchmark.
2.  **Step 2:** Click **Auto-Fill Mock Connection** in **STEP 2** of the workspace panel. This simulates retrieving validation credentials to authorize container uploads.
3.  **Step 3:** Review the inline Python script structure. Adjust Pillow's target resolution variables (`W:` and `H:`) in the workspace parameter bar to adjust output size parameters.
4.  **Step 4:** Select the target image in your storage index list and click **Run Serverless Pillow Function**.
5.  **Step 5:** Watch the container spin up. Review logs tracing loading calls, PIL initialization, processing timings, and server-side storage writes.
6.  **Step 6:** Review final comparison statistics under the **Optimization & Load Performance Metrics** section. Check performance calculations on standard 3G mobile networks.

---

## ⚙️ Core Sandbox Functions
*   `loadMockPreset(id)`: Imports preloaded SVG code, maps vectors to clean UI strings, and saves them to virtual memory registers.
*   `handleFileUpload(meta)`: Direct drag-and-drop file interface receiving user assets and mapping size structures correctly.
*   `handleTriggerResize()`: Runs the active image resizing loop, scaling visual layouts to matching outputs dynamically.
*   `calculateLoadTimeSeconds(bytes)`: Translates file sizing arrays to simulated latency timings.

---

## 🐍 Python Serverless PIL Automation
The project leverages a serverless Python trigger designed for **Azure Functions**. It automates cloud image resizing and compression using **Pillow (PIL)** and the **Azure Storage Blob** SDK directly in the cloud.

### Project Python Code Sample (`main.py`)
```python
import io
import os
from azure.storage.blob import BlobServiceClient
from PIL import Image

# Azure Storage connection details from environment variable
connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container_name = "images"  # Name of your container

def main(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    
    try:
        blob_name = req_body.get('blob_name') 
        if not blob_name:
            return func.HttpResponse(
                "Please pass a blob name in the request body",
                status_code=400
            )
    except ValueError:
        return func.HttpResponse(
             "Invalid JSON format in request body",
             status_code=400
        )
        
    # Initialize the Azure Storage Service Blob Client
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    
    # Obtain original image data stream
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    image_data = blob_client.download_blob().readall()
    
    try:
        # Open in memory bytes buffer using Pillow
        image = Image.open(io.BytesIO(image_data))
        
        # Resize image: Tweak these dimensions dynamically!
        resized_image = image.resize((500, 500))  
        
        # Save the resized image to an in-memory buffer
        output_buffer = io.BytesIO()
        resized_image.save(output_buffer, format="JPEG")  
        output_buffer.seek(0)
        
        # Upload the resized image back to the "resized/" folder prefix
        resized_blob_name = f"resized/{blob_name}" 
        resized_blob_client = blob_service_client.get_blob_client(container=container_name, blob=resized_blob_name)
        resized_blob_client.upload_blob(output_buffer, overwrite=True)
        
        return func.HttpResponse(f"Image '{blob_name}' resized and saved as '{resized_blob_name}'")
    except Exception as e:
        return func.HttpResponse(f"Error processing image: {str(e)}", status_code=500)
```

### How This Python Automation Works:
1. **Trigger Configuration:** The Azure Function is bound to a HTTP Request trigger (or an automated `BlobTrigger` that fires instantly whenever an image is uploaded to the `/original` bucket path).
2. **Environment Variable Security:** The script consumes API/Storage keys securely using `os.getenv('AZURE_STORAGE_CONNECTION_STRING')` so secrets are never hardcoded inside the code block.
3. **In-Memory Streaming:** Rather than reading/writing to the function's local file storage (which can slow down execution or run out of disk space in serverless containers), the script utilizes Python's `io.BytesIO()` module to hold image data directly in RAM.
4. **Pillow Graphics Engine:** The script parses raw byte streams into a Pillow `Image` object. It applies high-quality resizing logic using `Image.resize()`, then recompiles the pixel matrix back into compressed, web-optimized JPEG bytes.
5. **Secure Cloud Persistence:** Finally, it establishes a separate cloud target write handle via `resized_blob_client.upload_blob()`, storing the lightweight asset inside `/resized` for instant delivery across the corporate CDN.

---

## 🎛️ Windows IT Automation with Python (Examples)

Python is extremely powerful for managing Windows IT operations, provisioning hardware details, and cleaning directory files. Below are production-ready code samples demonstrating real-world IT task automation in Windows.

### 1. Automated Windows Temporary Cache & Log Purge Script
This utility searches designated directories (like `Temp` and log repositories), flags files older than a certain number of days, and deletes them safely. It generates a detailed cleanup report automatically for auditing.

```python
import os
import shutil
import time
from datetime import datetime, timedelta

def clean_windows_cache(target_dirs, day_threshold=14):
    print(f"[{datetime.now()}] Initiating general Windows System Purge...")
    cleared_files = 0
    saved_space = 0
    cutoff_time = time.time() - (day_threshold * 86400) # seconds in a day

    for directory in target_dirs:
        if not os.path.exists(directory):
            print(f"Directory {directory} not found, skipping...")
            continue
            
        print(f"Scanning directory: {directory}")
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                try:
                    file_stat = os.stat(file_path)
                    # Check modification time
                    if file_stat.st_mtime < cutoff_time:
                        file_size = file_stat.st_size
                        os.remove(file_path)
                        cleared_files += 1
                        saved_space += file_size
                        print(f"Deleted old file: {file} ({file_size / 1024:.1f} KB)")
                except Exception as e:
                    # Ignore locked files or execution permissions errors
                    pass
                    
    print(f"Cleanup Completed! Removed {cleared_files} files, reclaiming {saved_space / (1024*1024):.2f} MB of disk space.")

# How to trigger:
if __name__ == "__main__":
    # Standard Windows log and temp folders
    folders_to_clean = [
        r"C:\Windows\Temp",
        os.path.expandvars(r"%TEMP%"),
        r"C:\inetpub\logs\LogFiles"
    ]
    clean_windows_cache(folders_to_clean, day_threshold=7)
```

### 2. Active Windows Service Watchdog Timer and Restart System
This script queries Windows Services (e.g., Apache Server, SQL Server, custom API ports) and automatically restarts them if they are found offline, logged down, or dead.

```python
import subprocess
import time
import sys

def check_and_restart_service(service_name):
    print(f"Verifying status of system service: [ {service_name} ]")
    try:
        # Query service status via Windows command prompt tool
        result = subprocess.run(
            ['sc', 'query', service_name], 
            capture_output=True, 
            text=True, 
            check=True
        )
        
        if "RUNNING" in result.stdout:
            print(f"Service '{service_name}' is currently healthy and RUNNING.")
            return True
        else:
            print(f"⚠️ Service '{service_name}' is STOPPED or unresponsive. Attempting automatic recovery...")
            # Trigger service restart commands with administrator privileges
            subprocess.run(['net', 'start', service_name], check=True)
            print(f"✨ Successfully triggered restart command for service '{service_name}'.")
            return True
    except subprocess.CalledProcessError as err:
        print(f"❌ Error communicating with Service Controller for '{service_name}': {err}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Automate monitoring of critical Windows backends
    services_to_monitor = ["wuauserv", "Spooler"] # Windows Update and Print Spooler
    for service in services_to_monitor:
        check_and_restart_service(service)
```

---

## 🧪 Application Testing & Automation with Python (Examples)

Python is the absolute standard for QA teams to deploy automated browser user-flows, execute REST API regression testing, and validate operational sanity.

### 1. Automated Web Application Selenium end-to-end (E2E) Test Flow
This test automatially launches a Chrome database web browser window, loads a user sign-in page, fills credentials, clicks the login trigger, and asserts whether login was successful.

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class UserAuthenticationEndtoEndTest(unittest.TestCase):
    def setUp(self):
        # Configure headless browser execution structures
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless") # Runs tests quietly background without popping screen
        chrome_options.add_argument("--disable-gpu")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)
        
    def test_successful_login_workflow(self):
        driver = self.driver
        driver.get("https://brian-mccarthy-sandbox-demo.com/login")
        
        # Locate username and password element nodes
        username_field = driver.find_element(By.ID, "username-input")
        password_field = driver.find_element(By.ID, "password-input")
        submit_btn = driver.find_element(By.ID, "btn-submit-credentials")
        
        # Enter mock credential inputs simulating key strokes
        username_field.send_keys("brian_mccarthy_admin")
        password_field.send_keys("SecurePassword123!")
        submit_btn.click()
        
        # Wait until target dashboard metrics are loaded
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.ID, "dashboard-metrics-container"))
        )
        
        # Validate target application state
        welcome_banner = driver.find_element(By.ID, "welcome-message").text
        self.assertIn("Welcome, Brian McCarthy", welcome_banner)
        print("✅ End-to-End Authentication Test Passed successfully!")

    def tearDown(self):
        # Gracefully dismantle browser container to release system memory
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
```

### 2. High-Speed API Response Integrity & Performance Test
Ensures backend endpoints return correct structural responses within acceptable response times under load.

```python
import requests
import json
import time

def run_rest_api_assertion(test_endpoint):
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer DummyAccessTokenBrianMcCarthy123"
    }
    payload = {
        "action": "trigger_image_scaling",
        "blob_name": "resized/sunset_mountains.jpg",
        "quality": 85
    }

    print(f"Dispatching API load query to {test_endpoint}...")
    start_time = time.time()
    
    try:
        response = requests.post(test_endpoint, headers=headers, json=payload, timeout=5.0)
        end_time = time.time()
        latency_ms = (end_time - start_time) * 1000
        
        # Performance Assertion
        print(f"API latency: {latency_ms:.1f}ms")
        assert latency_ms < 1500, f"Performance SLA violated! Endpoint required over 1.5 seconds: {latency_ms}ms"
        
        # HTTP Code Assertion
        assert response.status_code == 200, f"Expected 200 OK, but received Status code {response.status_code}"
        
        # Structure Integrity Verification
        data = response.json()
        assert "status" in data, "Integrity Error: Missing status parameter key"
        assert data["status"] == "success", f"API completed with state: {data['status']}"
        
        print(f"✅ REST Endpoint Integration assertion completed: Healthy (200 OK in {latency_ms:.1f}ms)")
        return True
    except AssertionError as err:
        print(f"❌ Automation Test Case Failed: {err}")
        return False
    except Exception as e:
        print(f"❌ Infrastructure timeout or disconnect: {e}")
        return False

# Execution trigger
if __name__ == "__main__":
    run_rest_api_assertion("https://ais-pre-sicrw7pcj75cbb7sgabgzf-494688611919.us-west2.run.app/api/health")
```

---

## 📖 Tutorial Guide: Python Automation for IT Admins & QA Testers

Welcome to the **Complete Python Automation Starter Guide**. Whether your goal is to automate repetitive directory tasks on corporate machines, monitor critical services, or write continuous testing suites, Python provides all the tools you need. Follow this simple tutorial to write, execute, schedule, and secure scripts.

### 🪜 STEP 1: Establish Your Sandbox Virtual Environment
To protect your global operating system installations, always set up a standalone workspace (Virtual Environment) for new projects and scripts.

```bash
# 1. Open Terminal or PowerShell and navigate to your script directory
cd C:\LocalAutomationTools

# 2. Create the virtual environment container named ".venv"
python -m venv .venv

# 3. Activate the container
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS / Linux Terminal:
source .venv/bin/activate

# 4. Install standard packages securely
pip install requests pillow selenium azure-storage-blob pytest
```

### 🪜 STEP 2: Structure Your Automation Scripts with Clean Error Management
Never let a single down network request or locked operating system file crash your automation. Always enclose directory paths, API web clients, and database calls in structured `try-except-finally` blocks.

```python
# Save as: secure_backup.py
import shutil
import os
import sys

def execute_daily_backup(source_dir, backup_dir):
    # Guard clause: verify folder presence
    if not os.path.exists(source_dir):
        print(f"Source folder [{source_dir}] does not exist. Aborting operational script.")
        return False

    try:
        print("Compressing archive storage blocks...")
        # Zip all files within source directory
        shutil.make_archive(backup_dir, 'zip', source_dir)
        print("Daily Backup Archive exported successfully!")
        return True
    except PermissionError:
        print("❌ Operational Failure: System did not grant write-access permissions to destination folder.", file=sys.stderr)
    except Exception as general_err:
        print(f"❌ Operational Failure: Unexpected crash during archiving loop: {general_err}", file=sys.stderr)
    finally:
        print("Cleaning system IO hooks. Security thread closed.")

if __name__ == "__main__":
    execute_daily_backup(r"C:\LocalServer\SourceData", r"C:\BackupVault\Export-Daily-Archive")
```

### 🪜 STEP 3: Continuous QA Testing Setup with `pytest`
To automate application assert tests rather than running Python files manually, use `pytest`. Store test flows inside files prefixed with `test_` (e.g. `test_admin_portal.py`).

```python
# Save as: test_admin_portal.py
import pytest

# Simple calculation code to test
def calculate_bandwidth_savings(original_size, compressed_size):
    if original_size <= 0:
        return 0
    return round((1 - (compressed_size / original_size)) * 100, 2)

# Automated Pytest case
def test_valid_bandwidth_calculation():
    # Scenario: 4.0 MB scale down to 1.0 MB
    savings_percent = calculate_bandwidth_savings(4000000, 1000000)
    assert savings_percent == 75.00, "Math integrity mismatch!"

def test_division_by_zero_handling():
    # Scenario: zero input size should return 0 safely
    savings_percent = calculate_bandwidth_savings(0, 1000)
    assert savings_percent == 0, "Failed to reject invalid original sizes"
```
To run your test suite, simply run `pytest` in your directory terminal:
```bash
pytest test_admin_portal.py -v
```

### 🪜 STEP 4: Automate Execution on Schedules
Automate your scripts so they execute on set schedules, after system boots, or during nightly server quiet times.

#### 🪟 Windows Task Scheduler Setup:
1. Open the Start menu, search for **Task Scheduler**, and load it.
2. Under Actions, click **Create Basic Task**. Give your automation a name (e.g. `Nightly Windows Purge`).
3. Set the trigger to **Daily** or **Weekly** and specify your time.
4. Set Action to **Start a program**.
5. In the **Program/script** field, reference your Python virtual environment path:
   `C:\LocalAutomationTools\.venv\Scripts\python.exe`
6. In **Add arguments**, paste the absolute path to your Python script:
   `C:\LocalAutomationTools\secure_backup.py`
7. Click **Finish**. Your script is now fully automated!

#### 🐧 Linux/macOS Cron Setup:
To automate script executions on Linux or macOS systems, use crontab.
```bash
# Open crontab configurations
crontab -e

# Paste this line to automate execution every night at 3:00 AM:
0 3 * * * /LocalAutomationTools/.venv/bin/python /LocalAutomationTools/secure_backup.py >> /var/log/backup_cleanup.log 2>&1
```

---

## 📋 General Requirements
- **Web Browser:** Modern browser supports (Chrome, Edge, Firefox, Safari) with active Canvas rendering engines.
- **Node.js Environment:** Active Node 18+ version with standardized NPM tool packages installed.
- **Python Compiler:** Python version 3.10+ containing standard SDK packages (Pillow, requests, pytest).
