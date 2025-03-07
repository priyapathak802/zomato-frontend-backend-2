// Importing required modules

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Middlewares

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// MongoDB connection

mongoose.connect(
  "mongodb+srv://priyapathak3069:Betu8074367783@cluster0.vqbao.mongodb.net/backend?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log('DB connected...'))
  .catch((err) => console.log(err));

  // Root URL route
app.get('/', (req, res) => {
  res.send("<h1 align=center>Welcome to the Zomato </h1>");
});

// Register API
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User Registered.." });
    console.log("User Registration completed...");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login API

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    res.json({ message: "Login Successful", username: user.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Connecting Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
