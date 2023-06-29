const { getAll } = require('../manifest/utils');
const Logger = require('../logger');
const { registry } = require('../registry');
const { getRegistryList } = require('../roamingFolder');
const { getPublishedPackages, getArtifactTrkorr } = require('../functions');

module.exports = async(args) => {
    const connection = args.connection;
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    const packageName = args.arg1;
    const logger = Logger.getInstance();

    logger.loading("Retreiving package...");

    const allManifests = await getAll(connection);
    const allRegistry = getRegistryList();
    const publicRegistryAuth = allRegistry.find(o => o.name === 'public');
    //there could be more then 1 package with the same name (different registry)
    var foundManifests = allManifests.filter(o => o.manifest.name === packageName);
    for(var editManifest of foundManifests){
        var registryAuth;
        if(editManifest.manifest.registry && editManifest.manifest.registry.address){
            registryAuth = allRegistry.find(o => o.address === editManifest.manifest.registry.address);
        }else{
            registryAuth = publicRegistryAuth;
        }
        if(registryAuth){
            editManifest.registry = registry(registryAuth);
        }
    }

    if(foundManifests.length > 0){
        logger.info(`Package "${packageName}" on ${connection.client.dest}`);
        if(foundManifests.length > 1){
            logger.info(`Found ${foundManifests.length} packages.`);
        }
        logger.loading(`Reading data...`);
         
        var toLog = [];
        var publishedPackages;
        try{
            publishedPackages = await getPublishedPackages(rfcClient)
        }catch(e){
            publishedPackages = [];
        }
        for(const manifest of foundManifests){
            var logObj = {};
            logObj.registryName = manifest.registry ? manifest.registry.getName() : 'Unknown';
            logObj.version = manifest.manifest.version;
            try{
                const registryView = await manifest.registry.view(manifest.manifest.name, manifest.manifest.version);
                logObj.deprecated = registryView.release.deprecated ? 1 : 0;
                logObj.latest = registryView.release.latest ? 1 : 0;
            }catch(e){
                logObj.deprecated = -1;
                logObj.latest = -1;
            }
            try{
                logObj.trkorr = await getArtifactTrkorr(rfcClient, {
                    packageName: manifest.manifest.name,
                    registryAddress: manifest.registry.getAddress()
                });
            }catch(e){
                logObj.trkorr = null;
            }
            logObj.devclass = manifest.adtObject['adtcore:packageName'];
            logObj.publishedFromSystem = publishedPackages.find(o => o.devclass === logObj.devclass) ? true : false;
            logObj.description = manifest.manifest.description;
            logObj.private = manifest.manifest.private;
            logObj.git = manifest.manifest.gitRepository;
            logObj.website = manifest.manifest.website;
            logObj.license = manifest.manifest.license;
            try{
                logObj.authors = manifest.manifest.authors.join(', ');
            }catch(e){
                logObj.authors = null;
            }
            try{
                logObj.keywords = manifest.manifest.keywords.join(', ');
            }catch(e){
                logObj.keywords = null;
            }
            toLog.push(logObj);
        }

        toLog.forEach(o => {
            if(foundManifests.length > 1){
                logger.info(`==========================`);
            }
            logger.info(`Registry: ${o.registryName}`);
            if(logObj.deprecated === -1 || logObj.latest === -1){
                logger.info(`Version: ${o.version} - Cannot compare to registry.`);
            }else{
                if(logObj.deprecated === 1){
                    logger.error(`Version: ${o.version} - This version is marked as deprecated on the registry.`);
                }else{
                    if(logObj.latest === 1){
                        logger.success(`Version: ${o.version} - Latest available.`);
                    }else{
                        logger.warning(`Version: ${o.version} - Consider upgrading to latest.`);
                    }
                }
            }
            logger.info(`Devclass: ${o.devclass}`);
            if(o.description){
                logger.info(`Description: ${o.description}`);
            }
            if(o.private){
                logger.warning(`Private: Yes`);
            }
            if(o.git){
                logger.info(`Git repository: ${o.git}`);
            }
            if(o.website){
                logger.info(`Website: ${o.website}`);
            }
            if(o.license){
                logger.info(`License: ${o.license}`);
            }
            if(o.authors){
                logger.info(`Authors: ${o.authors}`);
            }
            if(o.keywords){
                logger.info(`Keywords: ${o.keywords}`);
            }
            if(o.trkorr){
                logger.info(`Linked transport request: ${o.trkorr}`);
            }
            if(o.publishedFromSystem){
                logger.info(`Published from ${connection.client.dest}: Yes`);
            }
        });
    }else{
        throw new Error(`Package "${packageName}" is not installed on system ${connection.client.dest}`);
    }
}