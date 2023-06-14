const { normalize } = require('../utils/commons');

module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_SYSTEM_CVERS", { });
    return normalize(rfcResult.ET_CVERS);
}