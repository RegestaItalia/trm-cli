const inquirer = require("inquirer");
const { getRegistryList } = require('../../roamingFolder');

module.exports = async (aRegistry) => {
    const registryList = aRegistry || getRegistryList();
    if (registryList.length === 0) {
        throw new Error('No registries defined.');
    }
    const answer = await inquirer.prompt([{
        type: "list",
        message: "Select registry",
        name: "registryData",
        pageSize: registryList.length >= 3 && registryList.length <= 19 ? registryList.length + 1 : 10,
        choices: registryList.map(o => {
            return {
                name: o.name,
                value: o
            }
        })
    }]);
    return answer.registryData;
}