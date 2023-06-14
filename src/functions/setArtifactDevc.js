module.exports = async(rfcClient, args) => {
    await rfcClient.call("ZTRM_SET_ARTIFACT_DEVC", {
        IS_MAPPING: {
            PACKAGE_NAME: args.packageName,
            REGISTRY: args.registryAddress,
            INSTALL_DEVCLASS: args.installDevclass,
            ORIGINAL_DEVCLASS: args.originalDevclass
        }
    });
}