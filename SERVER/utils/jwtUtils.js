const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie('token');
};

module.exports = { generateToken, setTokenCookie, clearTokenCookie };