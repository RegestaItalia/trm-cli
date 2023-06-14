module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_SET_ARTIFACT_TRKORR", {
        IS_DATA: {
            PACKAGE_NAME: args.packageName,
            REGISTRY: args.registryAddress,
            TRKORR: args.trkorr
        }
    });
    return rfcResult.EV_TRKORR;
}