const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_RELEASE_TR", {
        IV_LOCK: args.lock ? 'X' : ' ',
        IV_TRKORR: args.trkorr.toUpperCase()
    });
    return normalize(rfcResult.ET_MESSAGES);
}