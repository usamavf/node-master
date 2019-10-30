const express = require('express');
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fileupload = require('express-fileupload');
const errorhandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// route files
const bootcamp = require('./routes/bootcamp');
const auth = require('./routes/auth');

// load env vars
dotenv.config({path: './config/config.env'});

// connecting mongo
connectDB();

const app = express();

// Body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

app.use(morgan('dev'));


// file uploading
app.use(fileupload());

// set static folder for files to access /uploads/file.ext
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello from express app'});
})

// mount routes
app.use("/api/v1/bootcamps", bootcamp);
app.use('/api/v1/auth', auth);
app.use(errorhandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is up in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
});