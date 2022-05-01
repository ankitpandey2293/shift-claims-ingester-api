const express = require('express');
const router = express.Router();

/* GET HealthCheck */
router.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'Success'
  });
});


module.exports = router;
