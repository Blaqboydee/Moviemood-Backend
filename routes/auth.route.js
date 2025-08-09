const express = require('express');
const authrouter = express.Router();
const { googleLogin } = require('../controllers/auth.controller');

authrouter.post('/google-login', googleLogin);

module.exports = authrouter;