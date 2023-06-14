const listAllSktdManifests = require('../sktd/utils/listAllManifests');
const listAllIntfManifests = require('../intf/utils/listAllManifests');
const validateManifest = require('./validateManifest');

module.exports = async (adtClient, keepInvalid) => {
    var allObjs = [];
    const allSktd = await listAllSktdManifests(adtClient);
    var allIntf = await listAllIntfManifests(adtClient);
    allSktd.forEach(sktd => {
        const intfIndex = allIntf.findIndex(intf => intf.adtObject['adtcore:name'] === sktd.adtObject['adtcore:name']);
        if (intfIndex >= 0) {
            allIntf.splice(intfIndex, 1);
        }
    });
    allObjs = allObjs.concat(allSktd);
    allObjs = allObjs.concat(allIntf);

    var filtered = [];
    //filter results
    allObjs.forEach(o => {
        if (o.manifest) {
            try {
                o.manifest = validateManifest(o.manifest);
                filtered.push(o);
            } catch (e) {
                o.invalid = true;
                if(keepInvalid){
                    filtered.push(o);
                }
            }
        }
    });
    return filtered;
}