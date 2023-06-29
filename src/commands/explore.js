const { getAll } = require('../manifest/utils');
const Logger = require('../logger');
const { registry } = require('../registry');
const { getRegistryList } = require('../roamingFolder');

module.exports = async(args) => {
    const connection = args.connection;
    const adtClient = connection.adtClient;
    const packageName = args.arg1;
    const logger = Logger.getInstance();

    logger.loading("Retreiving infos...");

    const allManifests = await getAll(connection);
    const allRegistry = getRegistryList();
    //there could be more then 1 package with the same name (different registry)
    var foundManifests = allManifests.filter(o => o.manifest.name === packageName).map(o => o.manifest);
    for(var editManifest of foundManifests){
        if(editManifest.registry && editManifest.registry.address){
            const registryInstance = registry({

            });
        }
    }
    if(foundManifests.length > 0){
        for(const manifest of foundManifests){
            var sHeader = `Package "${packageName}" on ${connection.client.dest}`;
            console.log(manifest);
            if(foundManifests.length > 1 && manifest.registry && manifest.registry.address){
                sHeader = `${sHeader}, ${manifest.registry.address}`;
            }
            logger.info(sHeader);
            if(manifest.description){
                logger.info(`Description: ${manifest.description}`);
            }
        }
    }else{
        throw new Error(`Package "${packageName}" is not installed on system ${connection.client.dest}`);
    }
}