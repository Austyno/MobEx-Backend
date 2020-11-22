const Student = require('../models/Student');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getProfile = async (req, res, next) => {
    // console.log(req.user)

    const user = await User.findById(req.user.id)
    const courses = await Student.findOne({ studentId: req.user.id }).populate({
        path: 'courses',
        select:'title'
    });

    res.json({
        success: true,
        data: courses
    })

}