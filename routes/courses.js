const express = require('express');
const router = express.Router();

const { protect,authorize } = require('../middleware/auth');

const {
    addCourse,
    getAllCourses,
    getMyCourses,
    registerForACourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');


router.route('/')
    .post(protect, authorize, addCourse)
    .get(getAllCourses);

router.route('/:studentId/courses').get(protect, getMyCourses);

router.route('/register/:studentId').post(protect, registerForACourse);

router.route('/:courseId/update').put(protect, authorize, updateCourse)

router.route('/:courseId/delete').delete(protect,authorize,deleteCourse)



module.exports = router;