const getConfig = require('./getConfig');
const setConfig = require('./setConfig');

module.exports = (alias) => {
    var config = getConfig();
    if(config.aliases && Array.isArray(config.aliases)){
        const exists = config.aliases.find(o => o.name === alias.name);
        if(exists){
            throw new Error(`Alias ${alias.name} already exists. You may edit or delete.`);
        }else{
            config.aliases.push(alias);
        }
    }else{
        config.aliases = [alias];
    }
    setConfig(config);
}