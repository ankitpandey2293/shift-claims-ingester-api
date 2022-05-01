const { ResponseHelper } = require('../helpers');

class ClaimsControllerV1 {
    constructor({ state = {}, config }) {
        this.config = config;
        this.state = state;
    }
    /** 
     * @desc  Get claim
    */
    getClaim = async (req, res) => {
        const { params: { id } } = req;

        res.send(ResponseHelper.success({}, 'OK', 200));
    }

    /**
     * @desc  Save claims
     */
    saveClaims = async (req, res) => {
        const { body: { request_id, claims } } = req

        res.send(ResponseHelper.success({}, 'OK', 200));
    }

}

module.exports = ClaimsControllerV1