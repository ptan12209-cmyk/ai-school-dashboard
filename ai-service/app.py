# app.py - Placeholder for AI Service

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes, allowing requests from the frontend's origin
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/ai/health', methods=['GET'])
def health_check():
    """Health check endpoint to confirm the service is running."""
    return jsonify({"status": "ok", "service": "AI Service"}), 200

# Placeholder for a prediction endpoint
@app.route('/api/ai/predict', methods=['POST'])
def predict():
    """Placeholder for a future prediction endpoint."""
    # TODO: Implement AI model prediction logic here
    return jsonify({"status": "not_implemented", "prediction": None}), 501

if __name__ == '__main__':
    # Note: In production, use a proper WSGI server like Gunicorn
    app.run(port=8000, debug=True)

