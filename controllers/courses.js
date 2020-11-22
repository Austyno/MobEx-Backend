const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Student = require('../models/Student');

// @desc      Add course
// @route     POST /api/v1/courses
// @access    Private Admin
exports.addCourse = async (req, res, next) => {

    if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course`,
        401
      )
    );
    }
    
    const result = await Course.create(req.body);
    

    res.status(200).json({
    success: true,
    data: result
  });  
}

// @desc      Get all courses with reviews
// @route     GET /api/v1/courses
// @access    Public
exports.getAllCourses = async (req, res, next) => {

  try {
    //get all courses with reviews
    const courses = await Course.find({}).populate({
      path: 'reviews',
      select: 'title text rating'
    });
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(new ErrorResponse(`sorry we can not process your request at present. Please try again`, 500))
  }
}

// @desc      Get all courses a user registered for
// @route     GET /api/v1/courses/:userId/courses
// @access    Private
exports.getMyCourses = async (req, res, next) => {
  
  //get the logged in user from req.user, get the id from req.params.userId and compare
  if (req.user.id!== req.params.studentId) {
    return next(
      new ErrorResponse(`this user is not logged in`,401)
    )
  }

  //check if req.user.role is student
  if (req.user.role !== 'student') {
    return next(
      new ErrorResponse(`this user is not a student`,401)
    )
  }

    
  try {
    // find the student in students collection and populate with courses.
    const courses = await Student.findOne({ studentId: req.params.studentId }).populate('courses');

    res.status(200).json({
      success: true,
      count:courses.courses.length,
      data: courses
    })
  } catch (e) {
    return next(
      new ErrorResponse(`Could not get courses at this time`,500)
    )
  }

}
// @desc      Register a student for a course
// @route     POST /api/v1/courses/register/:userId
// @access    Private
exports.registerForACourse = async (req, res, next) => {

  if (req.user.id !== req.params.studentId) {
    return next(
      new ErrorResponse(`this user is not logged in`,401)
    )
  }

  //if they match, check if req.user.role is student
  if (req.user.role !== 'student') {
    return next(
      new ErrorResponse(`this user is not a student`,401)
    )
  }
 
  
  const { course } = req.body;
  const studentId = req.user.id;

  try {
    
    const student = await Student.find({ studentId });
    console.log(student)

    //check if student already exist in students collection
    if (student.length === 0) {
      const newStd = await new Student({
        studentId: req.user.id,
        courses: course,
        completed: 'inProgress'
      }).save()

      res.status(200).json({
      success: true,
      data: newStd
    })
      
    }else{
     const updated = await Student.find({ studentId }).updateOne({ $push: { courses: course }});

      res.status(200).json({
      success: true,
      data: updated
    })
    }
    
  } catch (error) {
    return next(
      new ErrorResponse(`oops`,500)
    )
  } 
}
// @desc      Update a course
// @route     PUT /api/v1/courses/:courseId/update
// @access    Private Admin
exports.updateCourse = async (req,res,next) => {

  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return next(
      ErrorResponse(`Course with the id ${req.params.courseId} does not exist`, 400)
    )
  }

  try {
    const updatedCourse = await Course.findOneAndUpdate(req.params.courseId, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: updatedCourse
    })
  } catch (error) {
    return next(
      ErrorResponse(`Course with the id ${req.params.courseId} does not exist`, 400)
    )
  }
}
// @desc      Delete a course
// @route     Delete /api/v1/courses/:courseId/delete
// @access    Private Admin
exports.deleteCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  // make sure course exist
  if (course === null) {
      return next(
        new ErrorResponse(`Course with the id ${req.params.courseId} does not exist`, 400)
      )
  }


  try {
    /**
     * TO DO
     * check if a student is registered for the course and prevent its deleting
     */
    const stdCourses = await Student.find({});

    stdCourses.map(async item => {
      let cs;
        item.courses.forEach(crs => {
          if (crs.toString() === req.params.courseId.toString()) {
            // item.courses.splice((item.courses.indexOf(crs)), 1);
            return next(new ErrorResponse('there is a student registered for this course so it cant be deleted',400))
          }
        })
      // await Student.findOneAndUpdate(item._id, {item.courses});
    });
    
    await course.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    return next(
      new ErrorResponse(`could not delete course at the moment, please try again`, 500)
    )
  }

}




