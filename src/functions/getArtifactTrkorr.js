module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_ARTIFACT_TRKORR", {
        IV_NAME: args.packageName,
        IV_REGISTRY: args.registryAddress
    });
    if(rfcResult.EV_STATUS === 'D'){
        return rfcResult.EV_TRKORR;
    }
}