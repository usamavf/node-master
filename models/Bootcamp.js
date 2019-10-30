const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a Name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more then 50 letters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a Discription'],
        maxlength: [500, 'Name cannot be more then 500 letters']
    },
    webiste: {
        type: String,
    },
    phone: {
        type: String,
        maxlength: [20, 'Number cannot be more then 20 digits'],
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            //required: true,
        },
        coordinates: {
            type: [Number],
            //required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRatting: {
        type: Number,
        min: [10, 'Rating must be at least 1'],
        max: [10, 'Rating must cannot be more then 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGurantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },

});

// create bootcamp slug from name
BootcampSchema.pre('save', function() {
    this.slug = slugify(this.name, { lower: true, });
})

// Geocode & create location field
BootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // do not save address in db
    this.address = undefined;
    next();
});

BootcampSchema.set('timestamps', true)

module.exports = mongoose.model('Bootcamp', BootcampSchema);