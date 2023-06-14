module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_OBJ_LOCK_TR", {
        IV_PGMID: args.pgmid,
        IV_OBJECT: args.object,
        IV_OBJ_NAME: args.objName
    });
    return rfcResult.EV_TRKORR;
}