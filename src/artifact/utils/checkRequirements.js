const { getSystemCvers } = require("../../functions")

module.exports = async (rfcClient, installRequirements) => {
    if(installRequirements.length === 0){
        return [];
    }
    var mismatchTable = [];
    const systemCvers = await getSystemCvers(rfcClient);
    installRequirements.forEach(o => {
        var errType = '';
        var component;
        var releaseRequired;
        var releaseSystem;
        var extReleaseRequired;
        var extReleaseSystem;
        if(o.component){
            const foundComponent = systemCvers.find(sc => sc.component === o.component);
            const release = o.release || '';
            const extrelease = (o.spLevel || '').replace(/^0+/, '');
            component = o.component;
            releaseRequired = o.release;
            extReleaseRequired = o.spLevel;
            if(foundComponent){
                const foundComponentRelease = foundComponent.release || '';
                const foundComponentExtRelease = (foundComponent.extrelease || '').replace(/^0+/, '');
                releaseSystem = foundComponent.release;
                extReleaseSystem = foundComponent.extrelease;
                if(release != foundComponentRelease){
                    errType = `${errType} Release`;
                }
                if(extrelease != foundComponentExtRelease){
                    errType = `${errType} ExtRelease`;
                }
            }else{
                errType = `${errType} Component`;
            }
            errType = errType.trim();
            if(errType){
                mismatchTable.push([errType, component || '', releaseRequired || '', releaseSystem || '', extReleaseRequired || '', extReleaseSystem || '']);
            }
        }
    });
    return mismatchTable;
}