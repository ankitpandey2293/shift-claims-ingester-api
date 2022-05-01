const express = require('express');
const router = express.Router();

/* GET HealthCheck */
router.get('/', (req, res, next) => {
  /** Check Redis,Enricher,AMQP during ping */
  
  res.status(200).send({
    message: 'Success'
  });
});


module.exports = router;
