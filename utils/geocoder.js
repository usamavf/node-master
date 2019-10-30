const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'xxxx',
    httpAdapter: 'https',
    apiKey: 'xxxxx',
    formatter: null
}

const geocoder = NodeGeocoder(options);
module.exports = geocoder;