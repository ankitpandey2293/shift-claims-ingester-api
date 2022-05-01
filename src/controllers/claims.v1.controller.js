const { ResponseHelper, ResponseHelper: { FormattedResponse } } = require('../helpers');
const { GlobalCache, EnricherAdapter } = require('../adapters')

class ClaimsControllerV1 {
    constructor({ state = {}, config = {} }) {
        this.config = config;
        this.state = state;
        this.globalCache = new GlobalCache({ state, config })
        this.enricherAdapter = new EnricherAdapter({ state, config })
    }
    /** 
     * @desc  Get claim
    */
    getClaim = async (req, res) => {
        const { headers: { orgID = 1 }, params: { id: uniqueID } } = req;
        /**
         * [1] Check Global Cache Store by Unique ID : FOR_FUTURE -> wrap it under singleflight duplication avoidance
         * [2] If not in global cache store , request for enrichment with ACK.
         * [3] Respond with 200 OK data or 400 as per enrichment request
         */
        let claim = await this.globalCache.getClaim(orgID, uniqueID)
        if (!claim) {
            claim = await this.enricherAdapter.enrichClaim(orgID, uniqueID);
        }
        if (!claim) {
            return res.status(FormattedResponse.ClaimNotFound.code).send(ResponseHelper.error(FormattedResponse.ClaimNotFound.message, FormattedResponse.ClaimNotFound.code));
        } else {
            return res.send(ResponseHelper.success(claim, 'OK', 200));
        }
    }

    /**
     * @desc  Save claims
     */
    saveClaims = async (req, res) => {
        const { headers: { orgID = 1 }, body: { request_id, claims } } = req
        /**
         * [1] Check duplication operation for request_id in Global Cache Store and setup mutex
         * [2] Check each claim for existence in enriched Global Cache Store by Unique ID
         * [3] Push claim in batch to processing queue for persistence
         * [4] Mark Error responses for duplicate Unique ID from enriched cache store
         * [5] Respond with success along with failed Duplicate Unique ID scenarios 
         */

        return res.send(ResponseHelper.success({}, 'OK', 200));
    }

}

module.exports = ClaimsControllerV1