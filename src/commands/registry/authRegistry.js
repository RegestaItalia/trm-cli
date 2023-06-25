const inquirer = require("inquirer");
const { getRegistryList, setRegistry } = require('../../roamingFolder');
const { registry } = require('../../registry');
const printMessage = require('./printMessage');
const Logger = require('../../logger');

module.exports = async (registryName, username, password) => {
    const logger = Logger.getInstance();
    var prompts = [];
    var registryInstance;
    const registryList = getRegistryList();
    var registryData = registryList.find(o => o.name === registryName);
    if (!registryData) {
        throw new Error(`Registry "${registryName}" not defined in ini file.`);
    }
    if(!username && !password){
        prompts.push({
            type: "input",
            message: "Registry username",
            name: "username",
            default: username,
            validate: (inputUsername) => {
                return inputUsername ? true : false
            }
        });
        prompts.push({
            type: "password",
            message: registryName !== 'public' ? "Registry password" : "Registry password",
            name: "password",
            default: password,
            validate: (inputPassword) => {
                return inputPassword ? true : false
            }
        });
        const answers = await inquirer.prompt(prompts);
        registryData.username = answers.username;
        registryData.password = answers.password;
    }else{
        registryData.username = username;
        registryData.password = password;
    }

    registryInstance = registry(registryData);

    logger.loading(`Logging into ${registryData.name === 'public' ? 'Public registry' : registryData.name}...`);

    const logonData = await registryInstance.logon();
    const ping = await registryInstance.ping();
    logger.success(`Logged in as ${logonData.username}`);
    if (ping.logonMessage) {
        printMessage(ping.logonMessage);
    }
    setRegistry(registryData);

    logger.success(`Saved registry data`);
    logger.success(`Registry authentication data is saved as plain text`);

    return registryData;
}