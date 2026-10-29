"""DNYFTECH API — version 0.2.0."""

import os
from flask import Flask, jsonify

APP_NAME = os.getenv("DNYFTECH_APP_NAME", "DNYFTECH API")
APP_VERSION = os.getenv("DNYFTECH_APP_VERSION", "0.2.0")

app = Flask(__name__)


@app.get("/")
def root():
    return jsonify({
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "online",
        "docs": "/api/v1/docs"
    })


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "dnyftech-api",
        "version": APP_VERSION
    })


@app.get("/api/v1/info")
def platform_info():
    return jsonify({
        "platform": "DNYFTECH",
        "tagline": "Engineering What's Next.",
        "version": APP_VERSION,
        "divisions": [
            "DNYF AI",
            "DNYF Labs",
            "DNYF Security",
            "DNYF Dev",
            "DNYF Systems",
            "DNYF Digital"
        ]
    })


@app.get("/api/v1/docs")
def documentation():
    return jsonify({
        "name": APP_NAME,
        "version": APP_VERSION,
        "endpoints": [
            {"method": "GET", "path": "/"},
            {"method": "GET", "path": "/health"},
            {"method": "GET", "path": "/api/v1/info"}
        ]
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
