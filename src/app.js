require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require("helmet");

const { healthCheckRouter, platformRouter } = require('./routes');

const app = express();

app.use(helmet());
app.use(morgan(':method :url :status :res[content-length] :response-time ms'));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

/** Routers for healthCheck & platform */
app.use('/ping', healthCheckRouter);
app.use('/platform', platformRouter);

module.exports = app;
