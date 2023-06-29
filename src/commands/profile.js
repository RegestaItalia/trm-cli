const { registry } = require('../registry');
const inquirer = require("inquirer");
const { authRegistry, printMessage } = require('./registry');


module.exports = async(args, changeLogonData) => {
    const registryData = args.registryData;
    const registryInstance = registry(registryData);
    const ping = await registryInstance.ping();
    const logonData = await registryInstance.logon();
    console.log(`Registry: ${registryInstance.getName()}`);
    console.log(`Type: ${registryInstance.getRegistryType()}`);
    if(registryInstance.getRegistryType() === 'private'){
        console.log(`Registry address: ${registryInstance.getAddress()}`);
    }
    if(ping.logonMessage){
        printMessage(ping.logonMessage);
    }
    console.log(`Username: ${logonData.username}`);
    console.log(`Password: *** (saved)`);
    const answers = await inquirer.prompt([{
        type: "confirm",
        message: "Change logon data?",
        name: "changeLogonData",
        default: changeLogonData === undefined ? false : changeLogonData
    }]);
    if(answers.changeLogonData){
        await authRegistry(args.registryData.name);
    }
}