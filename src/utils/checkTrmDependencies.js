const { getAll } = require('../manifest/utils');
const { trmDependencies } = require('../.././package.json');
const semverSatisfies = require('semver/functions/satisfies');

module.exports = async (adtClient, oTrmDependencies) => {
    var oRet = {
        missingPackages: [],
        validPackages: [],
        mismatchPackages: []
    };
    const allManifests = await getAll(adtClient);
    if(!oTrmDependencies){
        oTrmDependencies = trmDependencies || {};
    }
    for(const packageName of Object.keys(oTrmDependencies)){
        const targetVersion = oTrmDependencies[packageName];
        const oManifest = allManifests.find(o => o.manifest.name === packageName && !o.manifest.registry);
        var oObj = {
            name: packageName,
            range: targetVersion
        };
        if(oManifest && oManifest.manifest.version){
            if(semverSatisfies(oManifest.manifest.version, targetVersion)){
                oRet.validPackages.push(oObj);
            }else{
                oObj.installedVersion = oManifest.manifest.version;
                oRet.mismatchPackages.push(oObj);
            }
        }else{
            oRet.missingPackages.push(oObj);
        }
    }
    return oRet;
}