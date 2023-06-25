const { getRoamingFolder } = require('../utils/commons');
const constants = require('./constants');
const fs = require('fs');
const ini = require('ini');
const getRegistryList = require('./getRegistryList');

module.exports = (registry) => {
    const roamingDir = getRoamingFolder();
    const folder = `${roamingDir}\\${constants.FOLDER}`;
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    const filePath = `${folder}\\${constants.REGISTRY_FILE}`;
    var registryList = getRegistryList();
    var arrayIndex = registryList.findIndex(o => o.name === registry.name);
    if(arrayIndex >= 0){
        registryList[arrayIndex] = registry;
    }else{
        //throw new Error('Cant find registry')
        registryList.push(registry);
    }
    var oRegistryList = {};
    registryList.forEach(o => {
        oRegistryList[o.name] = { }
        if(o.address){
            oRegistryList[o.name].address = o.address;
        }
        if(o.username){
            oRegistryList[o.name].username = o.username;
        }
        if(o.password){
            oRegistryList[o.name].password = o.password;
        }
    });
    const sRegistryList = ini.encode(oRegistryList);
    fs.writeFileSync(filePath, sRegistryList);
}