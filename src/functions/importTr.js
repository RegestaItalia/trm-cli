module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_IMPORT_TR", {
        IV_TRKORR: args.trkorr.toUpperCase(),
        IV_SYSTEM: args.system.toUpperCase()
    });
}