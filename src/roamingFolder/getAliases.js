const getConfig = require('./getConfig');

module.exports = () => {
    const config = getConfig();
    if(config.aliases){
        return config.aliases;
    }else{
        return [];
    }
}