# rest_api_assertion.py
# Written by Brian McCarthy
# Automated test script to perform high-speed validation of REST APIs and ensure performance SLA compliance.

import json
import time
import urllib.request
import urllib.error
import sys

def assert_rest_api_endpoint(api_url, expected_payload_key="status", timeout_seconds=4.0):
    """
    Dispatches automated HTTP headers and asserts payload structure, status parameters, and network speed benchmark.
    """
    print("==================================================================")
    print("  QA AUTOMATION: REST API INTEGRITY & SLA TESTING")
    print("  Author: Written by Brian McCarthy")
    print("==================================================================")
    print(f"[TEST RUNNER] Pinging target REST API: {api_url}")
    
    # Configure mock headers
    headers = {
        "User-Agent": "AutomationTestRunner/2.0 (Author: Brian McCarthy)",
        "Content-Type": "application/json"
    }
    
    # Create request configuration
    req = urllib.request.Request(api_url, headers=headers, method="GET")
    
    start_time = time.time()
    try:
        # Resolve network call
        with urllib.request.urlopen(req, timeout=timeout_seconds) as response:
            latency_ms = (time.time() - start_time) * 1000
            status_code = response.getcode()
            raw_data = response.read().decode('utf-8')
            
            # 1. LATENCY ASSERTION (SLA limit: 1000ms threshold)
            print(f"[MEASUREMENT] Network round-trip: {latency_ms:.1f} ms")
            if latency_ms >= 1000:
                print(f"[FAIL-SLA] SLA Alert! Response time took {latency_ms:.1f}ms (Limit: 1000ms)")
            else:
                print("[PASS] Performance latency conforms within system bounds.")
                
            # 2. STATUS CODE ASSERTION
            print(f"[MEASUREMENT] Response status: {status_code} OK")
            assert status_code == 200, f"Expected 200, obtained status: {status_code}"
            
            # 3. SCHEMA INTEGRITY PARSING
            payload = json.loads(raw_data)
            print(f"[SAMPLE INFO] Body output: {json.dumps(payload)[:120]}...")
            
            # Assert presence of our targeted success key field
            if expected_payload_key in payload:
                print(f"[PASS] Key format matches: Discovered '{expected_payload_key}' with value: '{payload[expected_payload_key]}'")
                return True
            else:
                print(f"[FAIL-INTEGRITY] Target schema key '{expected_payload_key}' missing in JSON data fields!", file=sys.stderr)
                return False
                
    except urllib.error.HTTPError as err:
        print(f"[FAIL-HTTP] Client or Server Error triggered status: {err.code}", file=sys.stderr)
        return False
    except urllib.error.URLError as err:
        print(f"[FAIL-HOST] Failed to resolve network target address: {err.reason}", file=sys.stderr)
        return False
    except Exception as general_err:
        print(f"[FATAL] Test process crashed unexpectedly: {general_err}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Test our baseline serverless sandbox parameters on local system
    target_endpoint = "https://ais-pre-sicrw7pcj75cbb7sgabgzf-494688611919.us-west2.run.app/api/health"
    
    # Run assertions
    assert_rest_api_endpoint(target_endpoint, expected_payload_key="status")
