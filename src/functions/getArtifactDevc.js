const { normalize } = require('../utils/commons');

module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_ARTIFACT_DEVC", {
        IV_PACKAGE_NAME: args.packageName,
        IV_REGISTRY: args.registryAddress
    });
    return normalize(rfcResult.ET_DEVC_MAP);
}