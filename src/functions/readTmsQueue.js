const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_READ_TMS_QUEUE", {
        IV_TARGET: args.target.toUpperCase()
    });
    return normalize(rfcResult.ET_REQUESTS);
}