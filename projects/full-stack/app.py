from flask import Flask, jsonify
import os
import psycopg2

app = Flask(__name__)

init_db()

def get_connection():
    return psycopg2.connect(os.environ["DATABASE_URL"])

@app.route("/")
def home():
    return {"status": "API running"}

@app.route("/api/services")
def get_services():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT name, status FROM services;")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify([
        {"name": r[0], "status": r[1]} for r in rows
    ])
    
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
