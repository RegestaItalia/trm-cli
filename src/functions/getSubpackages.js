const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_SUBPACKAGES", {
        IV_DEVCLASS: args.devclass.toUpperCase()
    });
    return normalize(rfcResult.ET_SUBPACKAGES);
}