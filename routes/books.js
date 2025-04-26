const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookController = require('../controllers/bookController');
const { ensureAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(ensureAuthenticated);

// Get all books
router.get('/', bookController.getBooks);

// Add book form
router.get('/add', bookController.getAddBook);

// Add book
router.post('/add', [
  check('title', 'Title is required').notEmpty(),
  check('author', 'Author is required').notEmpty(),
  check('isbn', 'ISBN is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
  check('shelfLocation', 'Shelf location is required').notEmpty()
], bookController.postAddBook);

// Edit book form
router.get('/edit/:id', bookController.getEditBook);

// Update book
router.put('/edit/:id', [
  check('title', 'Title is required').notEmpty(),
  check('author', 'Author is required').notEmpty(),
  check('isbn', 'ISBN is required').notEmpty(),
  check('category', 'Category is required').notEmpty(),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
  check('shelfLocation', 'Shelf location is required').notEmpty()
], bookController.putUpdateBook);

// Delete book
router.delete('/delete/:id', bookController.deleteBook);

// Book details
router.get('/details/:id', bookController.getBookDetails);

module.exports = router;