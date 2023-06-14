const { getTrmVersion, getTrmServerVersion } = require('../utils/commons');
const Logger = require('../logger');

module.exports = async(args) => {
    const connection = args.connection;
    const adtClient = connection.adtClient;
    const logger = Logger.getInstance();

    logger.loading("Retreiving infos...");

    const trmClientVersion = getTrmVersion();
    const trmServerVersion = await getTrmServerVersion(adtClient);
    console.log(`TRM Client version: ${trmClientVersion}`);
    if(trmServerVersion){
        console.log(`TRM Server version: ${trmServerVersion}`);
        logger.success('Done');
    }else{
        logger.warning(`TRM Server is not installed on ${args.connection.client.dest}`);
    }
}