const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// EJS Configuration
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'partials/layout');

// Middleware to set the default filename for views
app.use((req, res, next) => {
    res.locals.filename = req.path.substring(1) || 'welcome';
    next();
});

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method override
app.use(methodOverride('_method'));

// Express session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: 'sessions'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            secure: process.env.NODE_ENV === 'production',  // Set to true in production
            httpOnly: true  // Prevents client-side JavaScript from accessing the cookie
        }
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Safely handle case when no user is logged in
    next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));  // Your provided index.js
app.use('/auth', require('./routes/auth'));  // Authentication routes
app.use('/students', require('./routes/students'));  // Student-related routes
app.use('/books', require('./routes/books'));  // Book-related routes
app.use('/loans', require('./routes/loans'));  // Loan-related routes

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found'
    });
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
