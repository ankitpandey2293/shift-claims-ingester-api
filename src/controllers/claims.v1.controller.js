const { ResponseHelper, ResponseHelper: { FormattedResponse } } = require('../helpers');
const { GlobalCache, EnricherAdapter, QueuePublisher } = require('../adapters')
const generateChecksum = require('object-hash');


class ClaimsControllerV1 {
    constructor({ state = {}, config = {} }) {
        this.config = config;
        this.config.maxBatchConcurrency = 2;
        this.state = state;
        this.globalCache = new GlobalCache({ state, config })
        this.enricherAdapter = new EnricherAdapter({ state, config })
        this.queuePublisher = new QueuePublisher();
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
        try {
            let claim = await this.globalCache.getClaim(orgID, uniqueID)
            if (!claim) {
                claim = await this.enricherAdapter.enrichClaim(orgID, uniqueID);
            }
            return res.send(ResponseHelper.success(claim, 'OK', 200));
        } catch (exception) {
            return res.status(exception.code || FormattedResponse.ServiceNotAvailable.code).send(ResponseHelper.error(exception.message || FormattedResponse.ServiceNotAvailable.message, exception.code || FormattedResponse.ServiceNotAvailable.code));
        }
    }

    /**
     * @desc  Save claims
     */
    saveClaims = async (req, res) => {
        let { headers: { orgID = 1 }, body: { request_id, claims } } = req
        /**
         * [1] Check duplication operation for request_id in Global Cache Store and setup mutex
         * [2] If number of claims is less than maxBatchConcurrency, 
         *       [2.1] Check each claim for existence in gRPC enrichmentService by Unique ID
         *       [2.2] If not existent then gRPC enrichmentService will persist the data and enrich Global Cache Store
         * [3] If number of claims is more  than maxBatchConcurrency,
         *       [3.1] Push claim in batch to processing AMQP queue for persistence
         * [4] Mark Error responses for duplicate Unique ID for case [2]
         * [5] Respond with success along with failed Duplicate Unique ID scenarios 
         */
        try {
            const claimsLength = claims.length;
            /** Generating Checksum for requests with now request_id */
            if (!request_id) request_id = generateChecksum(claims)
            const mutex = await this.globalCache.setClaimsBatchMutex(orgID, request_id)
            if (!mutex) throw FormattedResponse.IdempotentDrop
            /** Check if claims length is under maxBatchConcurrency */
            if (claimsLength <= this.config.maxBatchConcurrency) {

                /** Setup concurrent promises array to saveClaim via gRPC enrichment service */
                let claimsPromises = [];
                let inserted = [];
                let duplicate = []
                for (let count = 0; count < claimsLength; count++) {
                    claimsPromises.push(
                        new Promise((resolve, reject) =>
                            this.enricherAdapter.saveClaim(orgID, claims[count])
                                .then(data => { inserted.push(data.uniqueID); resolve(data) })
                                .catch(err => { duplicate.push(err.uniqueID); reject(err) })
                        )
                    )
                }

                /** Concurrently call all promises */
                await Promise.allSettled(claimsPromises)

                /** Respond with success and failed events */
                return res.status(200).send(ResponseHelper.success({ duplicate, inserted }, 'OK', 200));
            } else {
                /** Fire and Forget dispatcher */
                this.queuePublisher.dispatchBatch(orgID, claims)
                return res.status(200).send(ResponseHelper.success({ request_id }, 'Claims Submission Queued', 200));
            }
        } catch (exception) {
            /** Clear MUTEX in case of error of execution */
            await this.globalCache.deleteKey(`${orgID}:CL:MX:${request_id}`)
            if (exception.code && exception.message) {
                /** Send custom error responses */
                return res.status(exception.code).send(ResponseHelper.error(exception.message, exception.code));
            } else {
                /** Send failover exception responses */
                return res.status(FormattedResponse.ServiceNotAvailable.code).send(ResponseHelper.error(FormattedResponse.ServiceNotAvailable.message, FormattedResponse.ServiceNotAvailable.code));
            }
        }

    }

}

module.exports = ClaimsControllerV1