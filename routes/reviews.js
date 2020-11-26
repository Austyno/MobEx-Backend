const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
    addReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');

router.route('/').get(getReviews);

router.route('/:courseId/review').post(protect, addReview);
router.route('/:reviewId').get(getReview);
router.route('/:reviewId/update').put(protect,updateReview);
router.route('/:reviewId/delete').delete(protect,deleteReview);



module.exports = router;