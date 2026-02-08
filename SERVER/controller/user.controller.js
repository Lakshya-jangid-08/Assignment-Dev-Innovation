const User = require('../models/user.model.js');
const Note = require('../models/notes.model.js');
const Bookmark = require('../models/bookmarks.model.js');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/jwtUtils.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  try {
    
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }


    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    
    // Generate token
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    
    const userResponse = { ...user._doc };
    delete userResponse.password;
    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    // Don't send password back
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

const logoutUser = (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out successfully' });
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

const deleteProfile = async (req, res) => {
  try {
    // Delete user's notes and bookmarks first
    await Note.deleteMany({ userId: req.user.id });
    await Bookmark.deleteMany({ userId: req.user.id });
    
    // Delete user
    await User.findByIdAndDelete(req.user.id);
    
    // Clear cookie
    clearTokenCookie(res);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getProfile,
    deleteProfile
}