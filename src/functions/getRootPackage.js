module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_ROOT_PACKAGE", {
        IV_PACKAGE: args.package
    });
    return rfcResult.EV_ROOT_PACKAGE;
}