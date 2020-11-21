const mongoose = require('mongoose');
const Review = require('../models/Review');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    experienceLevel: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    what_you_would_learn: {
        type: String,
        required: true      
    },
    projects: {
        type: [String],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}, {
    timestamps:true
});


//Reverse populate course with all reviews
CourseSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'course',
    justOne: false
    
});


//cascade delete of reviews when a course is deleted
CourseSchema.pre('remove', async function (next) { 
    await this.model('Review').deleteMany({ course: this._id });
    next();
});

module.exports = mongoose.model('Course', CourseSchema);
