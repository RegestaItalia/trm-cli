const { getRoamingFolder } = require('../utils/commons');
const constants = require('./constants');
const fs = require('fs');

module.exports = (file) => {
    const roamingDir = getRoamingFolder();
    const folder = `${roamingDir}\\${constants.TMP_FOLDER}`;
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder, { recursive: true });
    }
    return folder;
}