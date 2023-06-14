module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_SOURCE_CODE", {
        IV_PACKAGE: args.devclass.toUpperCase()
    });
    return rfcResult.EV_ZIP;
}