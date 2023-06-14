const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_TADIR_ENTRY", {
        IV_PGMID: args.pgmid.toUpperCase(),
        IV_OBJECT: args.object.toUpperCase(),
        IV_OBJ_NAME: args.objName.toUpperCase()
    });
    return normalize(rfcResult.ES_TADIR);
}