const Student = require('../models/Student');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');


// @desc      Get logged in user profile
// @route     GET /api/v1/profiles/:userId
// @access    Private 
exports.getProfile = async (req, res, next) => {

    if (req.user.id !== req.params.userId) {
        return next(
            new ErrorResponse('You are not authorized view this profile',400)
        )
    }

    try {
        const user = await User.findById(req.params.userId).select('-password -role')
        res.status(200).json({
            success: true,
            data: user
        })
            
    } catch (error) {
        next(
            new ErrorResponse('sorry could not get the profile at this moment. Please try again',500)
        )
    }

}
// @desc      Update logged in user profile
// @route     Post /api/v1/profiles/:userId
// @access    Private 
exports.updateProfile = async (req, res, next) => {
    
    if (req.user.id !== req.params.userId) {
        return next(
            new ErrorResponse('You are not authorized view this profile',400)
        )
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true }).select('-password');
        
        res.status(200).json({
            success: true,
            data: user
        })
            
    } catch (error) {
        next(
            new ErrorResponse('sorry could not update the profile at this moment. Please try again',500)
        )
    }
}

