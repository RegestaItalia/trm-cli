const inquirer = require("inquirer");
const { getAliases, setAlias } = require('../../roamingFolder');
const Logger = require('../../logger');

module.exports = async(client) => {
    const logger = Logger.getInstance();
    const answers = await inquirer.prompt([{
        type: "input",
        message: "Alias name",
        name: "name",
        validate: (inputValue) => {
            if(inputValue){
                const aliases = getAliases();
                const exists = aliases.find(o => o.name.toUpperCase() === inputValue.toUpperCase());
                if(exists){
                    return `Alias "${inputValue}" already exists. You may edit or delete.`
                }else{
                    return true;
                }
            }
        }
    }]);

    const alias = {
        name: answers.name,
        client
    }
    setAlias(alias);
    
    logger.success(`Created alias "${alias.name}"`);
}