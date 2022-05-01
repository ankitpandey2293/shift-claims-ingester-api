const { ValidatorMiddleware } = require('../../middleware');

class BaseRoute {
    constructor({ feature, routes, config = {}, router, Controller }) {
        this.router = router;
        this.feature = feature;
        this.routes = routes;
        this.config = config;
        this.controller = new Controller({ config });
    }
    init = () => {
        this.routes.forEach(async route => {
            this.router[route.method](route.path, [...route.auth, ValidatorMiddleware(this.feature, route.controller), ...route.middleware], this.controller[route.controller])
        })
    }
}

module.exports = BaseRoute;