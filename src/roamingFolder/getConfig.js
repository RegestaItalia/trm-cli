const { getRoamingFolder } = require('../utils/commons');
const constants = require('./constants');
const fs = require('fs');

module.exports = () => {
    const roamingDir = getRoamingFolder();
    const folder = `${roamingDir}\\${constants.FOLDER}`;
    if(!fs.existsSync(folder)){
        fs.mkdirSync(folder, { recursive: true });
    }
    const filePath = `${folder}\\${constants.CONFIG_FILE}`;
    var ret;
    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath, JSON.stringify({}));
        ret = {};
    }else{
        const sJson = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
        ret = JSON.parse(sJson);
    }
    return ret;
}