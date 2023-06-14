
const AdmZip = require("adm-zip");
const { registry } = require('../registry');
const { tmpFile } = require('../roamingFolder');
const { getTransportContent } = require('node-r3trans');
const Logger = require('../logger');
const inquirer = require("inquirer");

const { installArtifact } = require('../artifact');

module.exports = async (args) => {
    /*const logger = Logger.getInstance();

    const connection = args.connection;
    const packageName = args.arg1;
    const packageVersion = args.version;
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    const registryData = args.registryData;
    const registryInstance = registry(registryData);*/

    await installArtifact(args);

}