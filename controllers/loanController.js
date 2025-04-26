const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const moment = require('moment');

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate('book')
      .populate('student')
      .populate('issuedBy')
      .sort({ issueDate: -1 });
    
    res.render('loans/index', {
      title: 'Loans Management',
      loans,
      moment
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching loans');
    res.redirect('/dashboard');
  }
};

// Get issue book form
exports.getIssueBook = async (req, res) => {
  try {
    const books = await Book.find({ availableQuantity: { $gt: 0 } }).sort({ title: 1 });
    const students = await Student.find().sort({ name: 1 });
    
    res.render('loans/issue', {
      title: 'Issue Book',
      books,
      students
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error loading form data');
    res.redirect('/loans');
  }
};

// Issue book
exports.postIssueBook = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    try {
      const books = await Book.find({ availableQuantity: { $gt: 0 } }).sort({ title: 1 });
      const students = await Student.find().sort({ name: 1 });
      
      return res.render('loans/issue', {
        title: 'Issue Book',
        errors: errors.array(),
        books,
        students,
        formData: req.body
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error loading form data');
      return res.redirect('/loans/issue');
    }
  }

  try {
    const { bookId, studentId, dueDate } = req.body;
    
    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      req.flash('error_msg', 'Book not found');
      return res.redirect('/loans/issue');
    }
    
    if (book.availableQuantity <= 0) {
      req.flash('error_msg', 'Book is not available for loan');
      return res.redirect('/loans/issue');
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      req.flash('error_msg', 'Student not found');
      return res.redirect('/loans/issue');
    }
    
    // Check if student already has this book
    const existingLoan = await Loan.findOne({
      book: bookId,
      student: studentId,
      status: { $ne: 'returned' }
    });
    
    if (existingLoan) {
      req.flash('error_msg', 'Student already has this book on loan');
      return res.redirect('/loans/issue');
    }
    
    // Create new loan
    const newLoan = new Loan({
      book: bookId,
      student: studentId,
      dueDate: new Date(dueDate),
      issuedBy: req.user._id
    });
    
    await newLoan.save();
    
    // Update book available quantity
    book.availableQuantity -= 1;
    await book.save();
    
    req.flash('success_msg', 'Book issued successfully');
    res.redirect('/loans');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error issuing book');
    res.redirect('/loans/issue');
  }
};

// Return book
exports.returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      req.flash('error_msg', 'Loan not found');
      return res.redirect('/loans');
    }
    
    if (loan.status === 'returned') {
      req.flash('error_msg', 'Book already returned');
      return res.redirect('/loans');
    }
    
    // Calculate fine if overdue
    const dueDate = new Date(loan.dueDate);
    const today = new Date();
    let fine = 0;
    
    if (today > dueDate) {
      const daysLate = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 1; // $1 per day late
    }
    
    // Update loan
    loan.returnDate = today;
    loan.status = 'returned';
    loan.fine = fine;
    await loan.save();
    
    // Update book available quantity
    const book = await Book.findById(loan.book);
    book.availableQuantity += 1;
    await book.save();
    
    req.flash('success_msg', 'Book returned successfully');
    res.redirect('/loans');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error returning book');
    res.redirect('/loans');
  }
};

// Get loan details
exports.getLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('book')
      .populate('student')
      .populate('issuedBy');
    
    if (!loan) {
      req.flash('error_msg', 'Loan not found');
      return res.redirect('/loans');
    }
    
    res.render('loans/details', {
      title: 'Loan Details',
      loan,
      moment
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching loan details');
    res.redirect('/loans');
  }
};