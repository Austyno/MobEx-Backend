const RequestSponsorship = require('../models/RequestSponsorship');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');



// @desc      Request for sponsorship
// @route     POST /api/v1/requestsponsors/
// @access    Private
exports.getSponsorship = async (req, res, next) => {
    const { student, course, sponsorName, sponsorEmail } = req.body;

    const courseToRegister = await Course.findById(course);
    
    if (req.user.id !== student) {
        return next(
            new ErrorResponse('The userId and logged in user do not match',400)
        )
    }


    if (courseToRegister === null) {
        return next(
             new ErrorResponse('The course does not exist',400)
         )   
    }
    
    const studentCode = `${req.user.name}_${crypto.randomBytes(3).toString('hex')}`;

    req.body.studentCode = studentCode

    const sponsorlink = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    const message = `You are receiving this email because ${req.user.name} has requested that you sponsor a course for them on our platform.\n Student Name: ${req.user.name}, \nStudent Code: ${studentCode} \nPlease click on the link below to go to our platform and view the details \n\n ${sponsorlink}`;

    try {
        const sponsorship = await RequestSponsorship.create(req.body);

        if (sponsorship) {
            sendEmail({
                email: sponsorEmail,
                message
            })
        }

        res.status(201).json({
            success: true,
            data: 'email sent'
        })

    } catch (error) {
        return next(
            new ErrorResponse('sorry we could not send your sponsor an email at this time, Please try again',500)
        )
    }


}
