document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dataForm = document.getElementById('data-form');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const dataList = document.getElementById('data-list');
    const refreshBtn = document.getElementById('refresh-btn');

    // Fetch and display data when page loads
    fetchData();

    // Form submission event
    dataForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (!name || !message) {
            alert('Please fill out all fields');
            return;
        }
        
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: `${name}: ${message}` })
            });
            
            if (response.ok) {
                // Clear form fields
                nameInput.value = '';
                messageInput.value = '';
                
                // Refresh data display
                fetchData();
                alert('Data submitted successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Refresh button event
    refreshBtn.addEventListener('click', fetchData);

    // Function to fetch and display data
    async function fetchData() {
        dataList.innerHTML = '<p id="loading">Loading data...</p>';
        
        try {
            const response = await fetch('/api/messages');
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            
            if (data.length === 0) {
                dataList.innerHTML = '<p>No data available. Add some data using the form above.</p>';
                return;
            }
            
            // Display the data
            dataList.innerHTML = '';
            data.forEach(item => {
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                dataItem.innerHTML = `
                    <h3>Message ID: ${item.id}</h3>
                    <p>${item.content}</p>
                    <button onclick="deleteMessage(${item.id})">Delete</button>
                `;
                
                dataList.appendChild(dataItem);
            });
        } catch (error) {
            console.error('Error:', error);
            dataList.innerHTML = `<p>Error loading data: ${error.message}</p>`;
        }
    }
});

// Function to delete a message
async function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            const response = await fetch(`/api/messages/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Message deleted successfully!');
                // Refresh the data display
                document.getElementById('refresh-btn').click();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }
}