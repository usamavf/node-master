const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Bootcamps = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');

const BootcampModel = require('../models/Bootcamp');

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), Bootcamps.bootcampPhotoUpload);

router
    .route('/')
    .get(protect, advancedResults(BootcampModel), Bootcamps.getBootcamps)
    .post(Bootcamps.createBootcamp)


router
    .route('/:id')
    .get(protect, Bootcamps.getBootcamp);



// router.get('/:id', Bootcamps.getBootcamp);

// router.post('/', (req, res) => {

// });

// router.put('/:id', (req, res) => {

// });

// router.delete('/:id', (req, res) => {

// });

module.exports = router;