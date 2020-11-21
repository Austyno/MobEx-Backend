const mongoose = require('mongoose');


const StudentSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [{type: mongoose.Schema.ObjectId,ref: 'Course'}]
}, {
    timestamps:true
})

module.exports = mongoose.model('Student', StudentSchema);