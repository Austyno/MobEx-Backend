const Review = require('../models/Review');
const Course = require('../models/Course');
const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');


// @desc      Add review
// @route     POST /api/v1/review/:courseId/review
// @access    Private
exports.addReview = async (req,res,next) => {
    req.body.user = req.user.id;
    req.body.course = req.params.courseId;

    //confirm course exist
   const course = await Course.findById(req.params.courseId);

    if (course === null) {
        return next(
            new ErrorResponse(`Course with id ${courseId} does not exist`, 400)
        );
    }

    //get reviewing student
    const student = await Student.findOne({ studentId: req.user.id });
    
    //check if they registered for this course
    const found = student.courses.includes(req.params.courseId);

    if (!found) {
        return next(
            new ErrorResponse('This user cannot review this course because they are not registered for the course',400)
        )
    }

    try {
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        })
    } catch (error) {
        next(
            new ErrorResponse(`Sorry we could not add the review. Please try again`, 500) 
        )
    }

}
// @desc      Get all reviews
// @route     Get /api/v1/reviews
// @access    Public
exports.getReviews = async (req, res, next) => {

    try {
        const reviews = await Review.find().populate({
            path: 'course',
            select: 'title description'
        }).populate({
            path: 'user',
            select: 'name email photo'
        });

        res.status(200).json({
            success: true,
            data: reviews
        })
        
    } catch (error) {
        next(
            new ErrorResponse(`Something went wrong. Please try again`,500)
        );
    }
}
// @desc      Get single review
// @route     Get /api/v1/reviews/:reviewId
// @access    Public
exports.getReview = async (req, res, next) => {
    
    try {
    const review = await Review.findById(req.params.reviewId).populate({
            path: 'user',
            select: 'name email photo'
        })

        res.status(200).json({
            success: true,
            data:review
        })
        
    } catch (error) {
        next(
            new ErrorResponse(`Something went wrong. Please try again`,500)
        );
    }
}
// @desc      Update review
// @route     PUT /api/v1/reviews/:reviewId/update
// @access    Private
exports.updateReview = async (req,res,next) => {

    const review = await Review.findById(req.params.reviewId);


    //make sure review exits
    if (review === null) {
        return next(
            new ErrorResponse(`Review with id ${req.params.reviewId} does not exist`,400)
        )
    }

    //update if user is admin
    if (req.user.role === 'admin') {
            try {

            const updateReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
                    new: true,
                    runValidators: true
            })
            
            res.status(200).json({
                success: true,
                data:updateReview
            })
            
        } catch (error) {
            return next(
                new ErrorResponse(`Some thing went wrong. Please try again`,500)
            )
        }
        
    }

    // make sure its the right owner
    if (review.user != req.user.id) {
        return next(
            new ErrorResponse(`You are not authorized to update this review`,403)
        )
    }

    try {

        const updateReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
                new: true,
                runValidators: true
        })
        
        res.status(200).json({
            success: true,
            data:updateReview
        })
        
    } catch (error) {
        return next(
            new ErrorResponse(`Some thing went wrong. Please try again`,500)
        )
    }

    
}
// @desc      Delete review
// @route     Delete /api/v1/reviews/:reviewId/delete
// @access    Private
exports.deleteReview = async (req,res,next) => {

    const review = await Review.findById(req.params.reviewId);


    //make sure review exits
    if (review === null) {
        return next(
            new ErrorResponse(`Review with id ${req.params.reviewId} does not exist`,400)
        )
    }

    //delete if user is admin
    if (req.user.role === 'admin') {
        try {
            review.remove();

            res.status(200).json({
                success: true,
                data:{}
            })
            
        } catch (error) {
            return next(
                new ErrorResponse(`Something went wrong. Please try again`,500)
            )
        }
        
    }

    // make sure its the right owner
    if (review.user != req.user.id) {
        return next(
            new ErrorResponse(`You are not authorized to update this review`,403)
        )
    }

    try {

        review.remove()
        
        res.status(200).json({
            success: true,
            data:{}
        })
        
    } catch (error) {
        return next(
            new ErrorResponse(`Some thing went wrong. Please try again`,500)
        )
    }

}
