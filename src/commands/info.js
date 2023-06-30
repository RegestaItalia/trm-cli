const { getTrmVersion } = require('../utils/commons');
const Logger = require('../logger');
const { getAll } = require('../manifest/utils');
const { checkTrmDependencies } = require('../utils');

module.exports = async(args) => {
    const connection = args.connection;
    const logger = Logger.getInstance();
    const asciiArt = `\n       ..:^~!77!~^::.                                                       
    ...:~!77????77!~:. .    :::::::::::. ::::::::.   .:::       ::::        
    !7!~^^:::::::::^~!77.   ~!!!!!!!!!!:.!!!~~~~!!~. :!!!^     :!!!~        
    !??????7!  ~7??????7.       ~!!:    .!!!.   ^!!~ :!!!!^   :!!!!~        
    !???????7. !???????7.       ~!!:    .!!!~^^^~!~: :!!!!!^ .!!~!!~        
    !???????7. !???????7.       ~!!:    .!!!~^^!!~.  :!!~:!!^~!^:!!~        
    !???????7. !????????.       ~!!:    .!!!.  :~!~. :!!~ :!!!^ :!!~        
    ^!!77???7. !????77!~        :^^.     :::.   .:^: .^::  :^:  .^^:        
       ..:^!!. !!~^:.                                                       \n`;

    logger.loading("Retreiving infos...");

    const trmDependencies = await checkTrmDependencies(connection);
    var trmDependenciesTable = [];
    const trmClientVersion = getTrmVersion();
    const allManifests = await getAll(connection);
    const serverManifest = allManifests.find(o => o.manifest.name === 'trm-server');
    trmDependencies.missingPackages.forEach(p => {
        trmDependenciesTable.push([p.name, p.range, '', 'MISSING']);
    });
    trmDependencies.mismatchPackages.forEach(p => {
        trmDependenciesTable.push([p.name, p.range, p.installedVersion, 'ERROR']);
    });
    trmDependencies.validPackages.forEach(p => {
        trmDependenciesTable.push([p.name, p.range, p.installedVersion, 'OK']);
    });
    if(!serverManifest || !serverManifest.manifest.version){
        logger.log(asciiArt);
        logger.warning(`TRM Server is not installed on ${args.connection.client.dest}`);
    }else{
        logger.log(asciiArt);
        logger.info(`TRM Server version: ${serverManifest.manifest.version}`);
    }
    logger.info(`TRM Client version: ${trmClientVersion}`);
    if(trmDependenciesTable.length > 0){
        logger.info(`TRM Client - Trm dependencies:`);
        logger.table(['Dependency', 'Required version', `Installed on ${connection.client.dest}`, 'Status'], trmDependenciesTable); 
    }
}