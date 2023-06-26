const { registry } = require('../registry');
const Logger = require('../logger');


module.exports = async(args) => {
    const logger = Logger.getInstance();
    const registryData = args.registryData;
    const registryInstance = registry(registryData);
    const packageName = args.arg1;
    const version = args.version;
    await registryInstance.unpublish(packageName, version);
    if(version){
        logger.success(`Package ${packageName}, version ${version}, deleted successfully.`);
    }else{
        logger.success(`Package ${packageName} deleted successfully.`);
    }
}