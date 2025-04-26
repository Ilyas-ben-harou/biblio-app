const Book = require('../models/Book');
const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.render('books/index', {
      title: 'Books Management',
      books
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching books');
    res.redirect('/dashboard');
  }
};

// Get add book form
exports.getAddBook = (req, res) => {
  res.render('books/add', {
    title: 'Add New Book'
  });
};

// Add new book
exports.postAddBook = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('books/add', {
      title: 'Add New Book',
      errors: errors.array(),
      book: req.body
    });
  }

  try {
    const { title, author, isbn, category, quantity, shelfLocation, publishedYear } = req.body;
    
    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      req.flash('error_msg', 'A book with this ISBN already exists');
      return res.redirect('/books/add');
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      quantity: parseInt(quantity),
      availableQuantity: parseInt(quantity),
      shelfLocation,
      publishedYear: parseInt(publishedYear)
    });

    await newBook.save();
    req.flash('success_msg', 'Book added successfully');
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error adding book');
    res.redirect('/books/add');
  }
};

// Get edit book form
exports.getEditBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash('error_msg', 'Book not found');
      return res.redirect('/books');
    }
    
    res.render('books/edit', {
      title: 'Edit Book',
      book
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching book');
    res.redirect('/books');
  }
};

// Update book
exports.putUpdateBook = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('books/edit', {
      title: 'Edit Book',
      errors: errors.array(),
      book: { ...req.body, _id: req.params.id }
    });
  }

  try {
    const { title, author, isbn, category, quantity, shelfLocation, publishedYear } = req.body;
    
    // Find book
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash('error_msg', 'Book not found');
      return res.redirect('/books');
    }

    // Calculate available quantity adjustment
    const quantityDifference = parseInt(quantity) - book.quantity;
    const newAvailableQuantity = book.availableQuantity + quantityDifference;
    
    if (newAvailableQuantity < 0) {
      req.flash('error_msg', 'Cannot reduce quantity below number of books currently on loan');
      return res.redirect(`/books/edit/${req.params.id}`);
    }

    // Update book
    book.title = title;
    book.author = author;
    book.isbn = isbn;
    book.category = category;
    book.quantity = parseInt(quantity);
    book.availableQuantity = newAvailableQuantity;
    book.shelfLocation = shelfLocation;
    book.publishedYear = parseInt(publishedYear);

    await book.save();
    req.flash('success_msg', 'Book updated successfully');
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error updating book');
    res.redirect(`/books/edit/${req.params.id}`);
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    // Check if book is on loan
    const activeLoans = await Loan.find({ 
      book: req.params.id,
      status: { $ne: 'returned' }
    });

    if (activeLoans.length > 0) {
      req.flash('error_msg', 'Cannot delete book that is currently on loan');
      return res.redirect('/books');
    }

    await Book.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Book deleted successfully');
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting book');
    res.redirect('/books');
  }
};

// Get book details
exports.getBookDetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash('error_msg', 'Book not found');
      return res.redirect('/books');
    }
    
    // Get loan history for this book
    const loans = await Loan.find({ book: req.params.id })
      .populate('student')
      .populate('issuedBy')
      .sort({ issueDate: -1 });
    
    res.render('books/details', {
      title: 'Book Details',
      book,
      loans
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error fetching book details');
    res.redirect('/books');
  }
};