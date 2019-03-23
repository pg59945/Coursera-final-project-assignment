const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compress = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const chalk = require('chalk');
const passport = require('passport');
const strategies = require('./passport');

const {
    logs
} = require('./env.vars');

const indexRouter = require('../resources/index.router');

const errors = require('../middlewares/errors');

const app = express();

mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);

// print mongoose logs in dev env
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger(logs));

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride('X-HTTP-Method-Override'))

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Passport

app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

// MongoStore conenection
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1209600000
    }, // two weeks in milliseconds
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true,
    })
}));

app.use('/api', indexRouter);

// if error is not an instanceOf APIError, convert it.
app.use(errors.converter);

// catch 404 and forward to error handler
app.use(errors.notFound);

// error handler, send stacktrace only during development
app.use(errors.handler);

module.exports = app;