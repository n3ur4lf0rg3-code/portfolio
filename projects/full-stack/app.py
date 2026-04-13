from flask import Flask, jsonify, request
from flask_cors import CORS

import os
import psycopg
import time

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": "*"
    }
})

def get_connection():
    return psycopg.connect(os.environ["DATABASE_URL"])

from flask import request

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")

# Rate limit simple en memoria
LAST_REQUEST = {}

@app.route("/admin/query", methods=["POST"])
def run_query():
    try:
        # 🔐 AUTH
        token = request.headers.get("Authorization")
        if token != ADMIN_TOKEN:
            return {"error": "Unauthorized"}, 401

        # ⏱ RATE LIMIT (1 req cada 2 segundos por IP)
        client_ip = request.remote_addr
        now = time.time()

        if client_ip in LAST_REQUEST:
            if now - LAST_REQUEST[client_ip] < 2:
                return {"error": "Too many requests"}, 429

        LAST_REQUEST[client_ip] = now

        # 📥 INPUT
        data = request.get_json()
        if not data or "query" not in data:
            return {"error": "Missing query"}, 400

        query = data["query"].strip().lower()

        # 🚫 BLOQUEAR TODO MENOS SELECT
        if not query.startswith("select"):
            return {"error": "Only SELECT allowed"}, 403

        # 🚫 BLOQUEAR palabras peligrosas
        forbidden = ["drop", "delete", "update", "insert", "alter"]
        if any(word in query for word in forbidden):
            return {"error": "Forbidden operation"}, 403

        # 🗄️ EJECUCIÓN
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(data["query"])
        result = cur.fetchall()

        cur.close()
        conn.close()

        return {"result": result}

    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/api/services", methods=["GET"])
def get_services():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, status FROM services;")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"id": r[0], "name": r[1], "status": r[2]} for r in rows
    ])


@app.route("/api/services/<int:id>", methods=["GET"])
def get_service(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, name, status FROM services WHERE id = %s;", (id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return {"error": "Not found"}, 404

    return {"id": row[0], "name": row[1], "status": row[2]}


@app.route("/api/services", methods=["POST"])
def create_service():
    try:
        data = request.get_json(force=True)

        if not data:
            return {"error": "No JSON received"}, 400

        name = data.get("name")
        status = data.get("status")

        if not name or not status:
            return {"error": "Missing fields"}, 400

        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO services (name, status) VALUES (%s, %s) RETURNING id;",
            (name, status)
        )

        new_id = cur.fetchone()[0]
        conn.commit()

        cur.close()
        conn.close()

        return {"id": new_id, "name": name, "status": status}, 201

    except Exception as e:
        return {"error": str(e)}, 500


@app.route("/api/services/<int:id>", methods=["PUT"])
def update_service(id):
    data = request.json

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "UPDATE services SET name = %s, status = %s WHERE id = %s;",
        (data["name"], data["status"], id)
    )

    conn.commit()

    cur.close()
    conn.close()

    return {"message": "updated"}


@app.route("/api/services/<int:id>", methods=["DELETE"])
def delete_service(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM services WHERE id = %s;", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "deleted"}
    
def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            name TEXT,
            status TEXT
        );
    """)

    cur.execute("SELECT COUNT(*) FROM services;")
    count = cur.fetchone()[0]

    if count == 0:
        cur.execute("""
            INSERT INTO services (name, status) VALUES
            ('auth', 'active'),
            ('payments', 'active'),
            ('ai-engine', 'pending');
        """)

    conn.commit()
    cur.close()
    conn.close()

@app.route("/api/contact", methods=["GET", "POST"])
def contact():
    try:
        conn = get_connection()
        cur = conn.cursor()

        # 🗄️ Garantizar tabla (se ejecuta una vez sin problema)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contact (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                message TEXT
            );
        """)

        # =========================
        # 📥 POST → INSERTAR
        # =========================
        if request.method == "POST":
            data = request.get_json(force=True)

            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            message = data.get("message", "").strip()

            # 🔐 VALIDACIÓN
            if not name or not message:
                return {
                    "status": "error",
                    "message": "Name and message required"
                }, 400

            if "@" not in email or "." not in email:
                return {
                    "status": "error",
                    "message": "Invalid email"
                }, 400

            cur.execute(
                "INSERT INTO contact (name, email, message) VALUES (%s, %s, %s) RETURNING id;",
                (name, email, message)
            )

            new_id = cur.fetchone()[0]
            conn.commit()

            return {
                "status": "success",
                "data": {
                    "id": new_id,
                    "name": name,
                    "email": email,
                    "message": message
                },
                "message": "Contact stored"
            }, 201

        # =========================
        # 📤 GET → LISTAR
        # =========================
        else:
            cur.execute("SELECT id, name, email, message FROM contact ORDER BY id DESC;")
            rows = cur.fetchall()

            data = []
            for row in rows:
                data.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "message": row[3]
                })

            return {
                "status": "success",
                "data": data
            }, 200

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:
        try:
            cur.close()
            conn.close()
        except:
            pass
    
init_db()
