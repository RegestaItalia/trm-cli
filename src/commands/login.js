const { registry } = require('../registry');
const { authRegistry } = require('./registry');
const profile = require('./profile');


module.exports = async(args) => {
    const registryData = args.registryData;
    const registryInstance = registry(registryData);
    if(registryInstance.hasAuthentication()){
        await profile(args, true);
    }else{
        await authRegistry(args.registryData.name);
    }
}