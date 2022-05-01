/**
 * @desc    Send any success response
 * @param   {object | array} data
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.success = (data, message, statusCode = 200) => {
  return {
    message,
    error: false,
    code: statusCode,
    data
  };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {object | string} err
 * @param   {number} status
 */
exports.error = (message, status) => {

  return {
    message,
    code: status,
    error: true
  };
};


exports.FormattedResponse = {
  ClaimNotFound: {
    code: 400,
    message: "Specified claim does not exist or since been archived."
  },
  ClaimAlreadySubmitted: {
    code: 400,
    message: "The claim has already been submitted."
  },
  ServiceNotAvailable: {
    code: 500,
    message: "The service isnt available at present. Kindly try again later"
  },
}
