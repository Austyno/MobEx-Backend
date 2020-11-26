const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({

   sponsoredStudent:{
       type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email'],
    }
}, {
    timestamps:true
});

module.exports = mongoose.model('SponsorSchema', SponsorSchema);

