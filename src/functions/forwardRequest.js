module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_FORWARD_TR", {
        IV_TRKORR: args.trkorr.toUpperCase(),
        IV_TARGET: args.target.toUpperCase(),
        IV_SOURCE: args.source.toUpperCase()
    });
}