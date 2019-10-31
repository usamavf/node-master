const express = require('express');
const dotenv = require("dotenv");
const morgan = require('morgan');
const path = require('path');
const fileupload = require('express-fileupload');
const errorhandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

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
app.use(express.urlencoded({
    extended: true
}));

// cookie parser
app.use(cookieParser());

app.use(morgan('dev'));

// file uploading
app.use(fileupload());

// Sanitize data for sql injection
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
    windowMs: 10*60*1000, // 10 mins
    max: 100
});

app.use(limiter);

// prevent http parameter pollution
//app.use(hpp);

// enable cors
app.use(cors());

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