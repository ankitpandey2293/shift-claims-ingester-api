require('dotenv').config();

const httpErrors = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');


const { responseHelper } = require('./helpers');
const { healthCheckRouter, platformRouter } = require('./routes');
const Sentry = require("@sentry/node");

/** Init Sentry */
Sentry.init({
    dsn: "https://48f9cde6f8b542e48cd743af82d60ab7@o1206815.ingest.sentry.io/6340323",
    environment: "staging",
    tracesSampleRate: 1.0
});

const app = express();

app.use(morgan(':method :url :status :res[content-length] :response-time ms'));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Enabled for lower environment
app.use(cors({
    origin: '*'
}));


/** Routers for healthCheck & platform */
app.use('/', healthCheckRouter);
app.use('/platform', platformRouter);

app.use((req, res, next) => {
    next(httpErrors(404));
});

app.use((err, req, res) => {
    res.status(err.status || 500).send(responseUtil.error(err.message || "Some error occurred while uploading document.", err.status));
});

module.exports = app;
