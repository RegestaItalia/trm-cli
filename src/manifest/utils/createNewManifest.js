const getNextNumerator = require('./getNextNumerator');
const sktdIsSupported = require('../sktd/utils/isSupported');
const intfIsSupported = require('../intf/utils/isSupported');
const createSktd = require('../sktd/utils/createManifest');
const createIntf = require('../intf/utils/createManifest');
const { getPackageNamespace } = require('../../utils/commons');
const manifestConstants = require('../manifestConstants');
const validateManifest = require('./validateManifest');

module.exports = async(args) => {
    const connection = args.connection;
    const adtClient = connection.adtClient;
    const devclass = args.devclass;
    const trkorr = args.trkorr;
    const registryAddress = args.registryAddress;
    var manifest = args.manifest;
    if(registryAddress !== 'public'){
        manifest.registry = {
            address: registryAddress
        };
    }
    manifest = validateManifest(manifest);

    const packageNs = getPackageNamespace(devclass);
    const objPrefix = packageNs === '$' ? 'Z' : packageNs;
    const objNumerator = await getNextNumerator(adtClient);
    const objName = `${objPrefix}${manifestConstants.OBJ_PREFIX}${objNumerator}`;
    const useSktd = await sktdIsSupported(adtClient);
    const useIntf = await intfIsSupported(adtClient);
    const createArgs = {
        connection,
        objName,
        devclass,
        trkorr,
        manifest
    };
    if(useSktd){
        //generate sktd
        await createSktd(createArgs);
    }else if(useIntf){
        //generate intf
        await createIntf(createArgs);
    }else{
        throw new Error('Manifest generation is not supported.');
    }
    
    return {
        PGMID: 'R3TR',
        OBJECT: useSktd ? 'SKTD' : 'INTF',
        OBJ_NAME: objName.toUpperCase()
    }
}