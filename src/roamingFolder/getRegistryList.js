const { getRoamingFolder } = require('../utils/commons');
const constants = require('./constants');
const ini = require('ini');
const fs = require('fs');

module.exports = () => {
    const roamingDir = getRoamingFolder();
    const folder = `${roamingDir}\\${constants.FOLDER}`;
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    var ret = [];
    const filePath = `${folder}\\${constants.REGISTRY_FILE}`;
    if (fs.existsSync(filePath)) {
        const sIni = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
        const parsed = ini.decode(sIni);
        Object.keys(parsed).forEach(key => {
            if (parsed[key].address || parsed[key].password) {
                ret.push({
                    name: key,
                    address: parsed[key].address,
                    username: parsed[key].username,
                    password: parsed[key].password
                });
            }
        });
    }
    if(!ret.find(o => o.name === 'public')){
        ret.push({
            name: 'public'
        });
    }
    return ret;
}