from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route("/api/services")
def get_services():
    return jsonify([
        {"name": "auth", "status": "active"},
        {"name": "payments", "status": "active"},
        {"name": "ai-engine", "status": "pending"}
    ])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
