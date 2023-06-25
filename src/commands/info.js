const { getTrmVersion } = require('../utils/commons');
const Logger = require('../logger');
const { getAll } = require('../manifest/utils')

module.exports = async(args) => {
    const connection = args.connection;
    const adtClient = connection.adtClient;
    const logger = Logger.getInstance();

    logger.loading("Retreiving infos...");

    const trmClientVersion = getTrmVersion();
    const allManifests = await getAll(adtClient);
    const serverManifest = allManifests.find(o => o.manifest.name === 'trm-server');
    if(!serverManifest || !serverManifest.manifest.version){
        logger.warning(`TRM Server is not installed on ${args.connection.client.dest}`);
    }else{
        logger.info(`TRM Server version: ${serverManifest.manifest.version}`);
    }
    logger.info(`TRM Client version: ${trmClientVersion}`);
}