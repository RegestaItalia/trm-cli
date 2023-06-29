const listAllSktdManifests = require('../sktd/utils/listAllManifests');
const listAllIntfManifests = require('../intf/utils/listAllManifests');
const validateManifest = require('./validateManifest');
const { getTadirEntry } = require('../../functions');

module.exports = async (connection, keepInvalid) => {
    const adtClient = connection.adtClient;
    const rfcClient = connection.rfcClient;
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
    for(var o of allObjs){
        if (o.manifest) {
            if(!o.adtObject["adtcore:packageName"]){
                //missing devclass from adt api
                //this will likely lead to unknown errors if not fixed
                const tadirEntry = await getTadirEntry(rfcClient, {
                    pgmid: 'R3TR',
                    object: o.adtObject["adtcore:type"].slice(0, 4),
                    objName: o.adtObject["adtcore:name"]
                });
                o.adtObject["adtcore:packageName"] = tadirEntry.devclass;
            }
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
    }
    return filtered;
}