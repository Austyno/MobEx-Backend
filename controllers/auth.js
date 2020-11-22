const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc      Create user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
    const { name, email, phone} = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    const password = hashPassword

    try {
        const user = await new User({name, email, phone, password}).save();
        const token = generateJwtToken(user._id);
        
        res.status(201).json({
            success: true,
            token
        })
        
    } catch (e) {

        next(
            new ErrorResponse("sorry we could not register you now . please try again",500)
        )
        
    }  

}

// @desc      Login User
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const matchPassword = bcrypt.compareSync(password, user.password);

    if (!matchPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = generateJwtToken(user._id);

    res.status(200).json({
        success: true,
        token

    })
    
}
// @desc      Get forgot password rest token.email will be sent to the user from the frontend and include the reset token
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = async (req,res,next) => {

    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
        next(
            new ErrorResponse(`There is no user with ${req.body.email}`, 404)
        )
    }
    
    try {
        //create reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        //hash token(for security purposes) and save to db
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        //create reset url
        // const restUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`
        
            res.status(200).json({
                success: true,
                data: resetToken,
                expiresIn : user.resetPasswordExpire
                })
    } catch (err) {
        next(
            new ErrorResponse(`Sorry Could not generate reset token at this point please try again`,500)
        )
        
    }   
}
// @desc      Rest password
// @route     PUT /api/v1/auth/resetpassword/:resettokken
// @access    Public
exports.resetPassword = async (req, res, next) => {
    
    // Get hashed token
  const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

    const user = await User.findOne(
        {
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        }
    )
    
    if (user === null) {
        return next(
            new ErrorResponse(`Invalid token`,400)
        )
    }

    try {
        const salt = await bcrypt.genSalt(10);

        const hashPassword = bcrypt.hashSync(req.body.password, salt);

        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined

        //generate token to log user in
        const token = generateJwtToken(user._id);

        await user.save();

        res.status(200).json({
            success: true,
            data: token
        })

        
    } catch (error) {
        next(
            new ErrorResponse('sorry we could not reset the password at this time',500)
        )
    }
}

//method to generate jwt login token
const generateJwtToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return token;
}