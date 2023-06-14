const intfConstants = require('../intfConstants');

module.exports = (objName) => {
    return intfConstants.URL_PREFIX + objName.trim().toLowerCase();
}