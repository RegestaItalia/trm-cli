const increaseVersion = require('./increaseVersion');

module.exports = async(registry, packageName) => {
    try{
        const published = await registry.view(packageName, 'latest');
        const latestVersion = published.release.version;
        return increaseVersion(latestVersion);
    }catch(e){
        return '0.0.1';
    }
}