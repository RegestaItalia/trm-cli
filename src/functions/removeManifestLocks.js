module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_DELETE_MANIFEST_LOCK", {
        IV_MANIFEST_TYPE: args.objType === 'SKTD' ? 1 : 2
    });
}