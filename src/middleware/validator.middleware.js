/* Include all validators */
const Validators = require('../validators')
const { ResponseHelper } = require('../helpers');
const { Constants: { PromiseStatus } } = require('../helpers')

module.exports = (validator, method) => {
    if (!Validators[validator])
        throw new Error(`'${validator}' validator does not exist`)

    return async (req, res, next) => {
        let promises = [];
        Object.keys(Validators[validator][method]).forEach(async (key) => {
            promises.push(Validators[validator][method][key].validateAsync(req[key]))
        });
        await Promise.allSettled(promises).then(results => {
            let successCount = 0
            for (let flag = 0; flag < promises.length; flag++) {
                if (results[flag].status == PromiseStatus.Fulfilled) {
                    successCount++
                } else {
                    res.status(400).send(ResponseHelper.error(results[flag].reason.message, 400))
                    return
                }
                if (successCount == promises.length) {
                    next()
                }
            }
        })
    }
}
