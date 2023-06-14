const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_DEVCLASS_OBJS", {
        IV_DEVCLASS: args.devclass.toUpperCase()
    });
    return normalize(rfcResult.ET_TADIR);
}