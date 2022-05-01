const express = require('express');
const router = express.Router();

const FeatureMap = {
    /* Claims Routes v1.0 */
    'ClaimsRoutesV1': { enabled: true, reference: require('./subroutes/claims.routes.v1') },
}

for (const [obj, feature] of Object.entries(FeatureMap)) {
    if (feature.enabled) {
        new feature['reference']({ router }).init()
    }
}

module.exports = router;
