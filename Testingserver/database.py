import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder='public')
# Enable CORS for all routes
CORS(app)

# Configure SQLite database - ensure directory exists and is accessible
basedir = os.path.abspath(os.path.dirname(__file__))
# Create instance directory if it doesn't exist
instance_path = os.path.join(basedir, 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)
    
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'mydatabase.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define a simple model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200))

# Create the database tables
with app.app_context():
    db.create_all()

# API Endpoints
@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = Message.query.all()
    return jsonify([{"id": msg.id, "content": msg.content} for msg in messages])

@app.route('/api/messages', methods=['POST'])
def add_messages():
    data = request.json
    # Check if we're receiving a list of messages or a single message
    messages_data = data if isinstance(data, list) else [data]
    
    added_messages = []
    for message_item in messages_data:
        new_message = Message(content=message_item['content'])
        db.session.add(new_message)
        added_messages.append({"id": new_message.id, "content": new_message.content})
    
    db.session.commit()
    return jsonify(added_messages)

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({"error": "Message not found"}), 404
    
    db.session.delete(message)
    db.session.commit()
    return jsonify({"success": True, "message": f"Message {message_id} deleted"})

# Serve static files from the public directory
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if path == "" or path == "/":
        return send_from_directory(app.static_folder, 'index.html')
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)