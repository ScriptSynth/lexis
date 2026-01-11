import requests
import json

# The base URL for the GPT-Research API
API_URL = "https://api.gpt-research.org/api/v1/inference"

def test_inference_post():
    """Tests the API using a POST request with a JSON body."""
    payload = {
        "prompt": "Summarize the benefits of AI in research in 2 sentences.",
        "model": "CamelGPT-mini-B" # You can change this to your custom model name if needed
    }
    headers = {"Content-Type": "application/json"}

    print("--- Testing POST Endpoint ---")
    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Result: {data.get('result')}")
        else:
            print(f"❌ Failed with status code: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"⚠️ Connection Error: {e}")

def test_inference_get():
    """Tests the API using a GET request with query parameters."""
    params = {
        "prompt": "Give me a one-line fact about quantum computing.",
        "model": "CamelGPT-mini-B"
    }

    print("\n--- Testing GET Endpoint ---")
    try:
        response = requests.get(API_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            print("✅ Success!")
            print(f"Result: {data.get('result')}")
        else:
            print(f"❌ Failed with status code: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"⚠️ Connection Error: {e}")

if __name__ == "__main__":
    test_inference_post()
    test_inference_get()