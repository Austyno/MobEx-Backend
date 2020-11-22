const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');


const {
    getProfile,
    updateProfile
} = require('../controllers/profile');


router.route('/:userId')
    .get(protect, getProfile)
    .post(protect, updateProfile);

module.exports = router;