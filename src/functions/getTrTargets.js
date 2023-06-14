const { normalize } = require('../utils/commons');

module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_TR_TARGETS", { });
    return normalize(rfcResult.ET_TMSCSYS);
}