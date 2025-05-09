fetch('/data.json')
 .then(response => response.json())
 .then(data => {
    let loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        let gmail = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        
        if (data.users) {
            const user = await checkCredentials(gmail, password);
            if (user) {
                window.location.href = '/index.html';
            } else {
                alert('Invalid email or password');
                console.error('Invalid credentials!');
            }
        } else {
            alert('No users found in system');
            console.error('No users found in data!');
        }
    });
 })
 .catch(error => {
   console.error('Error fetching data:', error);
   alert('Failed to load user data. Please try again later.');
 });

 // Check both data.json and localStorage
async function checkCredentials(email, password) {
    try {
        // First try to fetch from data.json
        const response = await fetch('/data.json');
        if (response.ok) {
            const data = await response.json();
            const user = data.users.find(u => u.email === email && u.password === password);
            if (user) return user;
        }
        
        // Fallback to localStorage
        const localUsers = JSON.parse(localStorage.getItem('quizAppUsers')) || [];
        return localUsers.find(u => u.email === email && u.password === password);
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}