const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const camp = await Bootcamp.findById(req.params.id);
    if (!camp) return next(new ErrorResponse(`Bootcamp not found`, 404));
    res.status(200).json({ success: true, data: camp });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Upload file for bootcamp
// @route   POST /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
        return next(
            new ErrorResponse(`Resource Not Found`, 404)
        );
    }

    if(!req.files) {
        return next(
            new ErrorResponse(`Please select a file`, 400)
        );
    }

    const file = req.files.file;

    // making sure image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please select an Image file`, 400)
        );
    }

    // checking file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please select an Image file less then ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // saving file to our server
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.log(err);
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        });
    })

});