const { getArtifactTrkorr, createImportTransport, setArtifactTrkorr, renameTransportRequest } = require('../../functions');
const Logger = require('../../logger');

module.exports = async (rfcClient, ns, packageName, version, registryAddress, skipGenerate) => {
    const logger = Logger.getInstance();
    var importTrkorr;
    if (ns !== '$') {
        //first see if there's already a transport for this package-version
        //if there isn't, generate a new one
        //all the objects will be in this transport, and a lock attempt will be made on all of them
        importTrkorr = await getArtifactTrkorr(rfcClient, {
            packageName,
            registryAddress
        });
        const importTrkorrDesc = `TRM: ${packageName} v${version}`;
        if (!importTrkorr) {
            if(!skipGenerate){
                importTrkorr = await createImportTransport(rfcClient, {
                    text: importTrkorrDesc
                });
                logger.success(`Generated transport ${importTrkorr}, description "${importTrkorrDesc}"`);
                await setArtifactTrkorr(rfcClient, {
                    packageName,
                    registryAddress,
                    trkorr: importTrkorr
                });
            }
        } else {
            logger.success(`Using transport ${importTrkorr}`);
            try {
                await renameTransportRequest(rfcClient, {
                    trkorr: importTrkorr,
                    description: importTrkorrDesc
                });
            } catch (e) {
                //don't throw
            }
        }
    }
    return importTrkorr;
}