const express = require('express');
const router = express.Router();
const Bootcamps = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');

const BootcampModel = require('../models/Bootcamp');

router
    .route('/:id/photo')
    .put(Bootcamps.bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResults(BootcampModel), Bootcamps.getBootcamps)
    .post(Bootcamps.createBootcamp)


router
    .route('/:id')
    .get(Bootcamps.getBootcamp);



// router.get('/:id', Bootcamps.getBootcamp);

// router.post('/', (req, res) => {

// });

// router.put('/:id', (req, res) => {

// });

// router.delete('/:id', (req, res) => {

// });

module.exports = router;