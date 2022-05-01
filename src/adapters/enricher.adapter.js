const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { FormattedResponse } = require("../helpers/response.helper");

/** TODO : This will be shifted to ENV or Configuration Management */
const ConnectionConfig = {
    URI: 'localhost:50051',
    PROTO_PATH: 'src/proto/claims_enricher.proto',
    options: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
}

class EnricherAdapter {
    constructor({ state = {}, config = {} }) {
        this.config = config;
        this.state = state;
        this.packageDefinition = protoLoader.loadSync(ConnectionConfig.PROTO_PATH, ConnectionConfig.options);
        this.ClaimsEnricherService = grpc.loadPackageDefinition(this.packageDefinition).ClaimsEnricherService;
        this.init();
    }
    /** 
     * @desc  Initialize gRPC Enricher Adapter  
    */
    init = () => {
        this.client = new this.ClaimsEnricherService(
            ConnectionConfig.URI,
            grpc.credentials.createInsecure()
        );
    }

    /**
     * @desc  Close gRPC Enricher Adapter  
    */
    close = () => {
        grpc.closeClient(this.client)
    }

    /**
     * @desc Enrich a unique claim via a gRPC service to Global Cache Store
     * @param {orgID} organizationID
     * @param {uniqueID} uniqueID sent by user while requesting a unique claim 
     * */
    enrichClaim = async (orgID, uniqueID) => {
        return new Promise((resolve, reject) => {
            this.client.enrichClaim({ orgID, uniqueID }, (error, claim) => {
                if (error && error.code == 3) {
                    reject(FormattedResponse.ClaimNotFound)
                }
                if (error) {
                    reject(new Error('Enrichment Not Available'))
                }
                resolve(claim)
            })
        })
    }

    /**
     * @desc Enrich a unique claim via a gRPC service to Global Cache Store
     * @param {orgID} organizationID
     * @param {claim} claim sent by user for persisting new claim 
     * */
    saveClaim = async (orgID, claim) => {
        return new Promise((resolve, reject) => {
            this.client.saveClaim({ orgID, ...claim }, (error, _result) => {
                if (error) {
                    reject({ uniqueID: claim.uniqueID })
                }
                resolve({ uniqueID: claim.uniqueID })
            })
        })
    }
}

module.exports = EnricherAdapter