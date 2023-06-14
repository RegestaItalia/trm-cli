module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_DIR_TRANS", {});
    return rfcResult.EV_DIR_TRANS;
}