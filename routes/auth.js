const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { forwardAuthenticated } = require('../middleware/auth');

// Register Page
router.get('/register', forwardAuthenticated, authController.getRegister);

// Register Handle
router.post('/register', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('password2', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })]
    , authController.postRegister);

// Login Page
router.get('/login', forwardAuthenticated, authController.getLogin);

// Login Handle
router.post('/login', authController.postLogin);

// Logout Handle
router.get('/logout', authController.logout);

module.exports = router;