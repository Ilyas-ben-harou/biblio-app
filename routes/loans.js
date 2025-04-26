const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const loanController = require('../controllers/loanController');
const { ensureAuthenticated } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(ensureAuthenticated);

// Get all loans
router.get('/', loanController.getLoans);

// Issue book form
router.get('/issue', loanController.getIssueBook);

// Issue book
router.post('/issue', [
  check('bookId', 'Book is required').notEmpty(),
  check('studentId', 'Student is required').notEmpty(),
  check('dueDate', 'Due date is required').notEmpty().isDate()
], loanController.postIssueBook);

// Return book
router.put('/return/:id', loanController.returnBook);

// Loan details
router.get('/details/:id', loanController.getLoanDetails);

module.exports = router;