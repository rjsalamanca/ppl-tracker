const express = require('express'),
    path = require('path'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors = require('cors');

const indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    pplSystemRouter = require('./routes/ppl_system');

const corsOptions = {
    // origin: '*'
    "origin": "http://localhost:3001",
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(session({
    store: new FileStore({ logFn: function () { } }),
    secret: 'get rad',
    resave: false,
    saveUninitialized: true,
    cookie: {
        is_logged_in: false
    }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ppl', pplSystemRouter);

module.exports = app;
