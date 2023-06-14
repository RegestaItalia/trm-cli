module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_RENAME_TRANSPORT_REQUEST", {
        IV_TRKORR: args.trkorr,
        IV_AS4TEXT: args.description
    });
}