const express = require('express');
const router = express.Router();


const { protect } = require('../middleware/auth');

const { getSponsorship, } = require('../controllers/requestSponsorship');

router.post('/',protect, getSponsorship);

module.exports = router;