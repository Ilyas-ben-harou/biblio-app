const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const studentController = require('../controllers/studentController');
const bookController = require('../controllers/bookController');
const loanController = require('../controllers/loanController');
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');

// Landing page (Welcome page)
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('welcome', { title: 'Welcome', layout: 'partials/layout' });
});

// Authentication routes (login, register)
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('auth/login', { title: 'Login', layout: 'partials/layout' });
});

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('auth/register', { title: 'Register', layout: 'partials/layout' });
});

// Dashboard (only accessible to authenticated users)
router.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);

// Students routes
router.get('/students', ensureAuthenticated, studentController.getStudents);  // Get all students

router.get('/students/add', ensureAuthenticated, studentController.getAddStudent);  // Add student form

router.post('/students/add', [
    check('name').notEmpty().withMessage('Name is required'),
    check('studentId').notEmpty().withMessage('Student ID is required'),
    check('email').isEmail().withMessage('Please include a valid email'),
    check('department').notEmpty().withMessage('Department is required')
], studentController.postAddStudent);
router.get('/students/edit/:id', ensureAuthenticated, studentController.getEditStudent);  // Edit student form
router.put('/students/edit/:id', [
    check('name').notEmpty().withMessage('Name is required'),
    check('studentId').notEmpty().withMessage('Student ID is required'),
    check('email').isEmail().withMessage('Please include a valid email'),
    check('department').notEmpty().withMessage('Department is required')
], studentController.putUpdateStudent);
router.delete('/students/delete/:id', ensureAuthenticated, studentController.deleteStudent);  // Delete student
router.get('/students/details/:id', ensureAuthenticated, studentController.getStudentDetails);  // View student details

// Books routes
router.get('/books', ensureAuthenticated, bookController.getBooks);  // Get all books
router.get('/books/add', ensureAuthenticated, bookController.getAddBook);  // Add book form
router.post('/books/add', [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('author').not().isEmpty().withMessage('Author is required'),
    check('isbn').not().isEmpty().withMessage('ISBN is required'),
    check('quantity').isInt().withMessage('Quantity must be a number'),
    check('shelfLocation').not().isEmpty().withMessage('Shelf Location is required'),
    check('publishedYear').isInt().withMessage('Published Year must be a number')
], bookController.postAddBook);
router.get('/books/edit/:id', ensureAuthenticated, bookController.getEditBook);  // Edit book form
router.put('/books/edit/:id', [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('author').not().isEmpty().withMessage('Author is required'),
    check('isbn').not().isEmpty().withMessage('ISBN is required'),
    check('quantity').isInt().withMessage('Quantity must be a number'),
    check('shelfLocation').not().isEmpty().withMessage('Shelf Location is required'),
    check('publishedYear').isInt().withMessage('Published Year must be a number')
], bookController.putUpdateBook);
router.delete('/books/delete/:id', ensureAuthenticated, bookController.deleteBook);  // Delete book
router.get('/books/details/:id', ensureAuthenticated, bookController.getBookDetails);  // View book details

// Loans routes
router.get('/loans', ensureAuthenticated, loanController.getLoans);  // Get all loans
router.get('/loans/issue', ensureAuthenticated, loanController.getIssueBook);  // Issue book form
router.post('/loans/issue', [
    check('bookId').not().isEmpty().withMessage('Book is required'),
    check('studentId').not().isEmpty().withMessage('Student is required'),
    check('dueDate').isDate().withMessage('Valid due date is required')
], loanController.postIssueBook);
router.put('/loans/return/:id', ensureAuthenticated, loanController.returnBook);  // Return book
router.get('/loans/details/:id', ensureAuthenticated, loanController.getLoanDetails);  // View loan details

module.exports = router;
