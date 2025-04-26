const Student = require('../models/Student');
const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

// Get all students
exports.getStudents = async (req, res) => {
    console.log('Entering getStudents controller');
    try {
        const students = await Student.find().sort({ name: 1 });
        console.log(`Found ${students.length} students`);
        res.render('students/index', {
            title: 'Students Management',
            students
        });
    } catch (err) {
        console.error('Error in getStudents:', err);
        req.flash('error_msg', 'Error fetching students');
        res.redirect('/dashboard');
    }
};

// Get add student form
exports.getAddStudent = (req, res) => {
    res.render('students/add', {
        title: 'Add New Student'
    });
};

// Add new student
exports.postAddStudent = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.render('students/add', {
        title: 'Add New Student',
        errors: errors.array(),
        student: req.body
      });
    }
  
    try {
      const { name, studentId, email, phone, department } = req.body;
      
      // Check if student with ID or email already exists
      const existingStudent = await Student.findOne({ 
        $or: [{ studentId }, { email }]
      });
      
      if (existingStudent) {
        req.flash('error_msg', 'A student with this ID or email already exists');
        return res.redirect('/students/add');
      }
  
      const newStudent = new Student({
        name,
        studentId,
        email,
        phone,
        department
      });
  
      await newStudent.save();
  
      // Log for debugging purposes
      console.log('Student added successfully');
      req.flash('success_msg', 'Student added successfully');
      res.redirect('/students');  // Redirect to the students list page
  
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error adding student');
      res.redirect('/students/add');  // Stay on the add page in case of an error
    }
  };
  


// Get edit student form
exports.getEditStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            req.flash('error_msg', 'Student not found');
            return res.redirect('/students');
        }

        res.render('students/edit', {
            title: 'Edit Student',
            student
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching student');
        res.redirect('/students');
    }
};

// Update student
exports.putUpdateStudent = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('students/edit', {
            title: 'Edit Student',
            errors: errors.array(),
            student: { ...req.body, _id: req.params.id }
        });
    }

    try {
        const { name, studentId, email, phone, department } = req.body;

        // Check if another student has the same ID or email
        const existingStudent = await Student.findOne({
            $or: [{ studentId }, { email }],
            _id: { $ne: req.params.id }
        });

        if (existingStudent) {
            req.flash('error_msg', 'Another student with this ID or email already exists');
            return res.redirect(`/students/edit/${req.params.id}`);
        }

        await Student.findByIdAndUpdate(req.params.id, {
            name,
            studentId,
            email,
            phone,
            department
        });

        req.flash('success_msg', 'Student updated successfully');
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating student');
        res.redirect(`/students/edit/${req.params.id}`);
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        // Check if student has active loans
        const activeLoans = await Loan.find({
            student: req.params.id,
            status: { $ne: 'returned' }
        });

        if (activeLoans.length > 0) {
            req.flash('error_msg', 'Cannot delete student with active loans');
            return res.redirect('/students');
        }

        await Student.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Student deleted successfully');
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting student');
        res.redirect('/students');
    }
};

// Get student details
exports.getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            req.flash('error_msg', 'Student not found');
            return res.redirect('/students');
        }

        // Get loan history for this student
        const loans = await Loan.find({ student: req.params.id })
            .populate('book')
            .populate('issuedBy')
            .sort({ issueDate: -1 });

        res.render('students/details', {
            title: 'Student Details',
            student,
            loans
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching student details');
        res.redirect('/students');
    }
};