require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const compression = require('compression');


const { ResponseHelper } = require('./helpers');
const { healthCheckRouter, platformRouter } = require('./routes');

const app = express();

app.use(morgan(':method :url :status :res[content-length] :response-time ms'));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: false }));

/** Routers for healthCheck & platform */
app.use('/ping', healthCheckRouter);
app.use('/platform', platformRouter);

app.use((req, res, next) => {
    res.status(404).send(ResponseHelper.error("Requested resource not available", 404));
});

app.use((err, req, res) => {
    res.status(err.status || 500).send(ResponseHelper.error(err.message || "Some error occurred while uploading document.", err.status));
});

module.exports = app;
