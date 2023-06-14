const updateSktd = require('../sktd/utils/updateManifest');
const updateIntf = require('../intf/utils/updateManifest');
const validateManifest = require('./validateManifest');

module.exports = async(args) => {
    const connection = args.connection;
    const trkorr = args.trkorr;
    const registryAddress = args.registryAddress;

    const manifest = args.manifest;
    const adtObj = manifest.adtObject;
    const objType = adtObj['adtcore:type'];
    const devclass = adtObj['adtcore:packageName'];
    const objName = adtObj['adtcore:name'];
    var manifestObj = manifest.manifest;
    if(registryAddress !== 'public'){
        manifestObj.registry = {
            address: registryAddress
        };
    }
    manifestObj = validateManifest(manifestObj);

    const updateArgs = {
        connection,
        objName,
        devclass,
        trkorr,
        manifest: manifestObj
    };
    if(objType === 'SKTD/TYP'){
        //update sktd
        await updateSktd(updateArgs);
    }else if(objType === 'INTF/OI'){
        //update intf
        await updateIntf(updateArgs);
    }else{
        throw new Error('Manifest type not supported.');
    }

    return {
        PGMID: 'R3TR',
        OBJECT: objType.slice(0,4),
        OBJ_NAME: objName.toUpperCase()
    }
}