const Joi = require('joi')

const Validator = {
    getClaim: {
        params: Joi.object({
            id: Joi.number().required('Unique ID of the claim').error(new Error('Claim unique id either not in correct format or not specified.'))
        })
    },
    saveClaims: {
        body: Joi.object({
            request_id: Joi.string().optional().description('Optional batch id as an idempotent key'),
            claims: Joi.array().items(Joi.object({
                uniqueID: Joi.number().required('Unique ID of the claim').error(new Error('Claim unique id either not in correct format or not specified.')),
                claimName: Joi.string().required().description('Name of the claim').error(new Error('Claim name not specified in correct format.')),
                verified: Joi.boolean().required().description('Claim verification status by our customers as real claim by their internal tool')
            })).max(2000).min(1)
        })
    }
}


module.exports = Validator;
