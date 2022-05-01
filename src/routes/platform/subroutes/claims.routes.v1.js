const featureName = 'claimsV1';
const BaseRouter = require('../../baseroute/base.route')
const { ClaimsControllerV1 } = require('../../../controllers');
const { RetrieveClaimsCache, SaveClaimsCache } = require('../../../middleware');

const RoutesMap = [
    {
        /**
         * [1] Claims listing route
         */
        method: 'get',
        path: '/v1/claims/:id',
        auth: [],
        middleware: [RetrieveClaimsCache],
        controller: 'getClaim',
    },
    {
        /**
         * [2] Add new claims
         */
        method: 'post',
        path: '/v1/claims',
        auth: [],
        middleware: [SaveClaimsCache],
        controller: 'saveClaims'
    }
]


class ClaimsRoutes extends BaseRouter {
    constructor({ config = {}, router }) {
        super({ feature: featureName, routes: RoutesMap, config, router, Controller: ClaimsControllerV1 })
    }
}

module.exports = ClaimsRoutes;