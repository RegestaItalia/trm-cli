const { getRoamingFolder } = require('../utils/commons');
const constants = require('./constants');
const fs = require('fs');

module.exports = (config) => {
    const roamingDir = getRoamingFolder();
    const folder = `${roamingDir}\\${constants.FOLDER}`;
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder, { recursive: true });
    }
    const filePath = `${folder}\\${constants.CONFIG_FILE}`;
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2)); 
}