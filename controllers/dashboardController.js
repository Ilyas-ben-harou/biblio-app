const Book = require('../models/Book');
const Student = require('../models/Student');
const Loan = require('../models/Loan');
const moment = require('moment');

exports.getDashboard = async (req, res) => {
    try {
        // Get counts
        const bookCount = await Book.countDocuments();
        const studentCount = await Student.countDocuments();
        const activeLoansCount = await Loan.countDocuments({ status: { $ne: 'returned' } });
        const overdueLoansCount = await Loan.countDocuments({
            status: 'issued',
            dueDate: { $lt: new Date() }
        });

        // Get recent loans
        const recentLoans = await Loan.find()
            .populate('book')
            .populate('student')
            .sort({ issueDate: -1 })
            .limit(5);

        // Get books with low stock
        const lowStockBooks = await Book.find({ availableQuantity: { $lt: 3 } })
            .sort({ availableQuantity: 1 })
            .limit(5);

        // Get overdue loans
        const overdueLoans = await Loan.find({
            status: 'issued',
            dueDate: { $lt: new Date() }
        })
            .populate('book')
            .populate('student')
            .sort({ dueDate: 1 })
            .limit(5);

        res.render('dashboard', {
            title: 'Dashboard',
            bookCount,
            studentCount,
            activeLoansCount,
            overdueLoansCount,
            recentLoans,
            lowStockBooks,
            overdueLoans,
            moment,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading dashboard data');
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user
        });
    }
};
