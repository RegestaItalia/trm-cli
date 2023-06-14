const { normalize } = require('../utils/commons');

module.exports = async(rfcClient) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_PUBLISHED_PACKAGES", {});
    return normalize(rfcResult.ET_PACKAGES);
}