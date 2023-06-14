const { getArtifactDevc } = require("../../functions");

module.exports = async(rfcClient, packageName, registryInstance) => {
    var packageMap = {};
    const fmPackageMap = await getArtifactDevc(rfcClient, {
        packageName,
        registryAddress: registryInstance.getAddress()
    });
    fmPackageMap.forEach(o => {
        packageMap[o.originalDevclass] = o.installDevclass;
    });
    return packageMap;
}