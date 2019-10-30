const mongoose = require('mongoose');

const connectDB = async () => {
    const con = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`Mongo Connected`);
}

module.exports = connectDB;