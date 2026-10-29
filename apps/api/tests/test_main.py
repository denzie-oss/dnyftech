from app.main import app

client = app.test_client()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json["name"] == "DNYFTECH API"
    assert response.json["status"] == "online"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_platform_info():
    response = client.get("/api/v1/info")
    assert response.status_code == 200
    assert response.json["platform"] == "DNYFTECH"
    assert "DNYF Security" in response.json["divisions"]


def test_api_docs():
    response = client.get("/api/v1/docs")
    assert response.status_code == 200
    assert len(response.json["endpoints"]) == 3


def test_local_frontend_cors():
    response = client.get(
        "/api/v1/info",
        headers={"Origin": "http://127.0.0.1:8080"}
    )
    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == (
        "http://127.0.0.1:8080"
    )
