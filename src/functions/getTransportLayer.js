module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_TRANSPORT_LAYER", { });
    return rfcResult.EV_LAYER;
}