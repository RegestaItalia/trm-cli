const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("REPOSITORY_ENVIRONMENT_RFC", {
        OBJ_TYPE: args.object.toUpperCase(),
        OBJECT_NAME: args.objName.toUpperCase()
    });
    return normalize(rfcResult.ENVIRONMENT_TAB);
}