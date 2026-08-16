import json
import statistics
import time
import urllib.request
import urllib.error

URL = "http://localhost:3000/api/chat"
PAYLOAD = {"message": "Me siento cansado por la carga académica"}
TOTAL_REQUESTS = 20

results = []

print(f"Iniciando medición: {TOTAL_REQUESTS} solicitudes a {URL}")

for index in range(TOTAL_REQUESTS):
    body = json.dumps(PAYLOAD).encode("utf-8")
    request = urllib.request.Request(
        URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    started = time.perf_counter()

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            response_body = response.read().decode("utf-8")
            status = response.status
            data = json.loads(response_body)
    except urllib.error.HTTPError as error:
        status = error.code
        data = {"error": error.read().decode("utf-8", errors="replace")}
    except Exception as error:
        status = 0
        data = {"error": type(error).__name__}

    duration_ms = (time.perf_counter() - started) * 1000
    ok = 200 <= status < 300

    result = {
        "request": index + 1,
        "status": status,
        "duration_ms": round(duration_ms, 2),
        "ok": ok,
        "emotion": data.get("emotion") if isinstance(data, dict) else None,
        "crisis_detected": data.get("crisisDetected") if isinstance(data, dict) else None,
        "request_id": data.get("request_id") if isinstance(data, dict) else None,
    }

    results.append(result)
    print(f"[{index + 1}/{TOTAL_REQUESTS}] status={status} duration_ms={result['duration_ms']}")

successful_times = [r["duration_ms"] for r in results if r["ok"]]
all_times = [r["duration_ms"] for r in results]
errors = sum(1 for r in results if not r["ok"])

if successful_times:
    sorted_times = sorted(successful_times)
    p50 = statistics.median(sorted_times)
    p95_index = min(len(sorted_times) - 1, max(0, int(len(sorted_times) * 0.95) - 1))
    p95 = sorted_times[p95_index]
else:
    p50 = None
    p95 = None

report = {
    "endpoint": URL,
    "requests": TOTAL_REQUESTS,
    "successful_requests": TOTAL_REQUESTS - errors,
    "errors": errors,
    "error_rate_percent": round(errors / TOTAL_REQUESTS * 100, 2),
    "p50_ms": round(p50, 2) if p50 is not None else None,
    "p95_ms": round(p95, 2) if p95 is not None else None,
    "max_ms": round(max(all_times), 2) if all_times else None,
    "results": results,
}

print("\n=== RESULTADO FINAL ===")
print(json.dumps(report, indent=2, ensure_ascii=False))