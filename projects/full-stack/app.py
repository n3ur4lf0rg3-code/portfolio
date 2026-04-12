from flask import Flask, jsonify, request
import os
import psycopg

app = Flask(__name__)

def get_connection():
    return psycopg.connect(os.environ["DATABASE_URL"])

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
init_db()
