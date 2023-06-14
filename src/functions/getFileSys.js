module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_FILE_SYS", {});
    return rfcResult.EV_FILE_SYS;
}