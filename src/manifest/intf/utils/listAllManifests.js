const manifestConstants = require('../../manifestConstants');
const readManifest = require('./readManifest');

module.exports = async (adtClient) => {
    var ret = [];
    var objectsFound = [];
    var response = [];
    const zObjects = await adtClient.searchObject(`Z*${manifestConstants.OBJ_PREFIX}*`, 'INTF');
    const yObjects = await adtClient.searchObject(`Y*${manifestConstants.OBJ_PREFIX}*`, 'INTF');
    const nsObjects = await adtClient.searchObject(`/*/*${manifestConstants.OBJ_PREFIX}*`, 'INTF');

    response = response.concat(zObjects);
    response = response.concat(yObjects);
    response = response.concat(nsObjects);

    response.forEach(o => {
        if(new RegExp(`^(?:Z|Y|\\/\\w*\\/)${manifestConstants.OBJ_PREFIX}\\d*$`, 'g').test(o['adtcore:name'])){
            objectsFound.push(o);
        }
    });

    //filter results
    //they have to match manifest structure
    for (const o of objectsFound) {
        try {
            const manifest = await readManifest(o['adtcore:name'], adtClient);
            ret.push({
                adtObject: o,
                manifest
            });
        } catch (e) { }
    }
    return ret;
}