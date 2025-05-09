// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve your frontend files

app.post('/api/register', (req, res) => {
    const dataPath = path.join(__dirname, 'data.json');
    const newUser = req.body;
    
    fs.readFile(dataPath, (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading data' });
        
        const jsonData = JSON.parse(data);
        if (jsonData.users.some(user => user.email === newUser.email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        newUser.id = jsonData.users.length + 1;
        jsonData.users.push(newUser);
        
        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Error saving data' });
            res.json({ success: true });
        });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));