from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)