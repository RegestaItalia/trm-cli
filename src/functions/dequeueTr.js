module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_DEQUEUE_TR", {
        IV_TRKORR: args.trkorr.toUpperCase()
    });
}