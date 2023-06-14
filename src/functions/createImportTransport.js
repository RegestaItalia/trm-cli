module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_CREATE_IMPORT_TR", {
        IV_TEXT: args.text
    });
    return rfcResult.EV_TRKORR;
}