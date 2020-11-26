const mongoose = require('mongoose');

const RequestSponsorshipSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required:true

    },
    sponsorName: {
        type: String,
        required:true
    },
    sponsorEmail: {
        type: String,
        required: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email'],
    },
    studentCode: {
        type: String,
        required:true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, {
    timestamps:true
});

module.exports = mongoose.model('RequestSponsorship', RequestSponsorshipSchema);