const { getAll } = require("../../manifest/utils");

module.exports = async(adtClient, packageName, registryInstance) => {
    const registryType = registryInstance.getRegistryType();
    const registryAddress = registryInstance.getAddress();
    const allSystemManifests = await getAll(adtClient);
    const updateManifest = allSystemManifests.find(o => {
        const manifestRegistry = o.manifest.registry;
        const manifestName = o.manifest.name;
        if (manifestName === packageName) {
            if (registryType === 'public') {
                if (!manifestRegistry) {
                    return o;
                }
            } else {
                if (manifestRegistry) {
                    const manifestAddr = manifestRegistry.address;
                    if (registryAddress === manifestAddr) {
                        return o;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    });
    return updateManifest;
}