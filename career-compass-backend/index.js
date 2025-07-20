const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Use middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' folder

// Basic route for testing
app.get('/', (req, res) => {
  // Retrieve the message from the query string (if any)
  const message = req.query.message || '';
  res.send(`
    <h1>Welcome to Career Compass!</h1>
    <p>${message}</p>
  `);  // Display message on the homepage
});

// In-memory mock database for storing users
let users = [];

// Registration route
app.post('/register', (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  // Simple validation
  if (password !== confirmPassword) {
    return res.redirect('/?message=Passwords do not match!');
  }

  // Check if email already exists
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.redirect('/?message=Email already in use!');
  }

  // Save new user (in-memory mock database)
  const newUser = { fullname, email, password };
  users.push(newUser);

  res.redirect('/?message=User registered successfully!');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.redirect('/?message=User not found!');
  }

  // Check password
  if (user.password !== password) {
    return res.redirect('/?message=Incorrect password!');
  }

  res.redirect('/?message=Login successful!');
});

// Set the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
