module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_CREATE_TOC", {
        IV_TEXT: args.text,
        IV_TARGET: args.target.toUpperCase()
    });
    return rfcResult.EV_TRKORR;
}