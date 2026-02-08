const express = require('express');
const authRoutes = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { createUser, loginUser, logoutUser, getProfile, deleteProfile } = require('../controller/user.controller.js');

// SIGNUP
authRoutes.post('/signup', createUser);

// LOGIN
authRoutes.post('/login', loginUser);

// LOGOUT
authRoutes.post('/logout', logoutUser);

// GET PROFILE (Protected)
authRoutes.get('/profile', protect, getProfile);

// DELETE ACCOUNT (Protected)
authRoutes.delete('/delete', protect, deleteProfile);


module.exports = authRoutes;