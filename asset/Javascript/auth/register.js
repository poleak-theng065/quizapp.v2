const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize data.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
}

// API Endpoint: Register new user
app.post('/api/register', (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Read existing data
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const jsonData = JSON.parse(data);
        
        // Check if email exists
        if (jsonData.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const newUser = {
            id: jsonData.users.length > 0 ? Math.max(...jsonData.users.map(user => user.id)) + 1 : 1,
            name: fullname,
            email: email,
            password: password
        };

        // Add user and save
        jsonData.users.push(newUser);
        
        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ success: true, message: 'Registration successful' });
        });
    });
});

// Serve the registration page
app.get('/register', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>Quiz App Register</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <style>
            body { font-family: "Roboto", sans-serif; }
        </style>
    </head>
    <body class="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div class="w-full max-w-md bg-white border-2 border-orange-500 rounded-lg shadow-lg p-6 sm:p-8">
            <div class="flex justify-center mb-6">
                <img alt="Quiz app logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full" src="/asset/image/LogoQuizApp.png" />
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-6 sm:mb-8">
                Create Your Quiz App Account
            </h1>
            <form id="registerForm" class="space-y-5 sm:space-y-6">
                <div>
                    <label class="block text-black font-semibold mb-2 text-sm sm:text-base" for="fullname">
                        Full Name
                    </label>
                    <div class="relative">
                        <input class="w-full border border-orange-400 rounded-md py-2.5 sm:py-3 px-3 sm:px-4 pr-10 text-black placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                            id="fullname" name="fullname" placeholder="John Doe" required type="text" />
                        <span class="absolute inset-y-0 right-3 flex items-center text-orange-500 text-sm sm:text-base">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="block text-black font-semibold mb-2 text-sm sm:text-base" for="email">
                        Email Address
                    </label>
                    <div class="relative">
                        <input class="w-full border border-orange-400 rounded-md py-2.5 sm:py-3 px-3 sm:px-4 pr-10 text-black placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                            id="email" name="email" placeholder="you@example.com" required type="email" />
                        <span class="absolute inset-y-0 right-3 flex items-center text-orange-500 text-sm sm:text-base">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="block text-black font-semibold mb-2 text-sm sm:text-base" for="password">
                        Password
                    </label>
                    <div class="relative">
                        <input class="w-full border border-orange-400 rounded-md py-2.5 sm:py-3 px-3 sm:px-4 pr-10 text-black placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                            id="password" name="password" placeholder="Create a password" required type="password" />
                        <span class="absolute inset-y-0 right-3 flex items-center text-orange-500 cursor-pointer text-sm sm:text-base"
                            onclick="togglePassword()">
                            <i class="fas fa-eye" id="eyeIcon"></i>
                        </span>
                    </div>
                </div>
                <div>
                    <label class="block text-black font-semibold mb-2 text-sm sm:text-base" for="confirmPassword">
                        Confirm Password
                    </label>
                    <div class="relative">
                        <input class="w-full border border-orange-400 rounded-md py-2.5 sm:py-3 px-3 sm:px-4 pr-10 text-black placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                            id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required type="password" />
                        <span class="absolute inset-y-0 right-3 flex items-center text-orange-500 cursor-pointer text-sm sm:text-base"
                            onclick="toggleConfirmPassword()">
                            <i class="fas fa-eye" id="eyeIconConfirm"></i>
                        </span>
                    </div>
                </div>
                <button class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md transition-colors duration-300 text-sm sm:text-base"
                    type="submit">
                    Register
                </button>
            </form>
            <p class="mt-6 text-center text-black text-sm sm:text-base">
                Already have an account?
                <a class="text-orange-600 font-semibold hover:text-orange-800" href="/login">
                    Log in
                </a>
            </p>
        </div>

        <script>
            // Handle form submission
            document.getElementById('registerForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = {
                    fullname: document.getElementById('fullname').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value,
                    confirmPassword: document.getElementById('confirmPassword').value
                };

                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();
                    
                    if (response.ok) {
                        alert(result.message || 'Registration successful!');
                        window.location.href = '/login';
                    } else {
                        alert(result.error || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Registration failed. Please try again.');
                }
            });

            // Password toggle functions
            function togglePassword() {
                const passwordInput = document.getElementById("password");
                const eyeIcon = document.getElementById("eyeIcon");
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
                } else {
                    passwordInput.type = "password";
                    eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
                }
            }

            function toggleConfirmPassword() {
                const confirmPasswordInput = document.getElementById("confirmPassword");
                const eyeIconConfirm = document.getElementById("eyeIconConfirm");
                if (confirmPasswordInput.type === "password") {
                    confirmPasswordInput.type = "text";
                    eyeIconConfirm.classList.replace("fa-eye", "fa-eye-slash");
                } else {
                    confirmPasswordInput.type = "password";
                    eyeIconConfirm.classList.replace("fa-eye-slash", "fa-eye");
                }
            }
        </script>
    </body>
    </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});