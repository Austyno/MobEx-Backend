const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'this email is already in use'],
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email'],
    },
    phone: {
        type: String,
        required: true,
        unique: [true, 'a user with this number already exist']
    },
    password: {
        type: String,
        required: [true,'please enter a password'],
    },
    photo: {
        type: String,
        default:'no_photo.jpg'
    },
    experience: {
        type: String
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire:{type: Date},
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
}, {
        toJSON: { virtuals:true },
        toObject: { virtuals:true }
});
//get all reviews by this user
UserSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'user'
    
});
//get all courses registered by this user
UserSchema.virtual('courses', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'studentId'
    
});


const Usermodel = mongoose.model('User', UserSchema);

module.exports = Usermodel;