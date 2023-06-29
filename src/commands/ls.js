const { getAll } = require('../manifest/utils');
const Table = require('cli-table');
const Logger = require('../logger');

module.exports = async (args) => {
    const connection = args.connection;
    const adtClient = connection.adtClient;
    const logger = Logger.getInstance();
    
    logger.loading("Reading installed packages...");

    const allManifest = await getAll(connection);
    var consoleObj = [];
    allManifest.forEach(obj => {
        const manifest = obj.manifest;
        consoleObj.push({
            name: manifest.name,
            version: manifest.version,
            registry: manifest.registry ? `${manifest.registry.address}` : 'public'
        });
    });
    if (consoleObj.length > 0) {
        var tableData = [];
        consoleObj.forEach(cObj => {
            tableData.push([cObj.name, cObj.version, cObj.registry]);
        });
        logger.info(`Displaying ${consoleObj.length} installed packages.`);
        logger.table(['Name', 'Version', 'Registry'], tableData);
    } else {
        logger.error(`No packages were found.`);
    }
}