const sktdConstants = require('../sktdConstants');

module.exports = (objName) => {
    return sktdConstants.URL_PREFIX + objName.trim().toLowerCase();
}