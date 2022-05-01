const { ResponseHelper } = require('../helpers');
const { Constants: { PromiseStatus } } = require('../helpers')

exports.RetrieveClaimsCache = async (req, res, next) => {
    // TODO: FUTURE_SCOPE Internal Cache Middleware to check for local presence 
    next()
};

exports.SaveClaimsCache = async (req, res, next) => {
    // TODO: FUTURE_SCOPE Internal Cache Middleware to check for singleflight local presence
    next()
};