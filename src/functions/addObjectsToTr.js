const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_ADD_OBJS_TR", {
        IV_LOCK: args.lock ? 'X' : ' ',
        IV_TRKORR: args.trkorr.toUpperCase(),
        IV_OBJECTS_JSON: JSON.stringify(args.objs)
    });
    return normalize(rfcResult.ET_LOG);
}