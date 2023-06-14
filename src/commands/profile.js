const { registry } = require('../registry');
const inquirer = require("inquirer");
const { authRegistry, printMessage } = require('./registry');


module.exports = async(args) => {
    const registryData = args.registryData;
    const registryInstance = registry(registryData);
    const logonData = await registryInstance.logon();
    console.log(`Registry: ${registryInstance.getName()}`);
    console.log(`Type: ${registryInstance.getRegistryType()}`);
    if(registryInstance.getRegistryType() === 'private'){
        console.log(`Registry address: ${registryInstance.getAddress()}`);
    }
    if(logonData.wallMessage){
        printMessage(logonData.wallMessage);
    }
    console.log(`Username: ${logonData.username}`);
    console.log(`Password: *** (saved)`);
    const answers = await inquirer.prompt([{
        type: "confirm",
        message: "Change logon data?",
        name: "changeLogonData",
        default: false
    }]);
    if(answers.changeLogonData){
        await authRegistry(args.registryData.name, true);
    }
}