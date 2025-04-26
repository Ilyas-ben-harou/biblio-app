// const express = require('express');
// const router = express.Router();
// const { check } = require('express-validator');
// const studentController = require('../controllers/studentController');
// const { ensureAuthenticated } = require('../middleware/auth');

// // Apply authentication middleware to all routes
// router.use(ensureAuthenticated);

// // Get all students
// router.get('/', studentController.getStudents);

// // Add student form
// router.get('/add', studentController.getAddStudent);

// // Add student
// router.post('/add', [
//   check('name', 'Name is required').notEmpty(),
//   check('studentId', 'Student ID is required').notEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('department', 'Department is required').notEmpty()
// ], studentController.postAddStudent);

// // Edit student form
// router.get('/edit/:id', studentController.getEditStudent);

// // Update student
// router.put('/edit/:id', [
//   check('name', 'Name is required').notEmpty(),
//   check('studentId', 'Student ID is required').notEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('department', 'Department is required').notEmpty()
// ], studentController.putUpdateStudent);

// // Delete student
// router.delete('/delete/:id', studentController.deleteStudent);

// // Student details
// router.get('/details/:id', studentController.getStudentDetails);

// module.exports = router;