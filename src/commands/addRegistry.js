const { getRegistryList, setRegistry } = require('../roamingFolder');
const Logger = require('../logger');
const inquirer = require("inquirer");
const { authRegistry, printMessage } = require('./registry');
const { registry } = require('../registry');

module.exports = async(args) => {
    const logger = Logger.getInstance();
    const registryName = args.arg1.trim();
    if(registryName === 'public'){
        throw new Error('Registry name "public" is a reserver keyword.');
    }
    const registryList = getRegistryList();
    const exists = registryList.find(o => o.name === registryName);
    if(exists){
        throw new Error(`Registry "${registryName}" already exists. You may edit or delete it.`);
    }
    var address;
    if(args.address){
        address = args.address;
    }else{
        const addressPrompt = await inquirer.prompt([{
            type: "input",
            message: "Registry address",
            name: "address"
        }]);
        address = addressPrompt.address;
    }
    const registryData = {
        name: registryName,
        address
    };
    const registryInstance = registry(registryData);
    const ping = await registryInstance.ping();
    if(ping.wallMessage){
        printMessage(ping.wallMessage);
    }
    //add to ini
    setRegistry(registryData);
    logger.success(`Registry "${registryName}" saved.`);

    //auth
    const answer = await inquirer.prompt([{
        type: "confirm",
        message: "Do you want to login?",
        name: "login",
        default: true
    }]);
    if(answer.login){
        await authRegistry(registryName);
    }
}