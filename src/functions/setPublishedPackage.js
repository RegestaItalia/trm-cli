module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_SET_PUBLISHED_PACKAGE", {
        IS_TRM_PUBLISH: {
            PACKAGE_NAME: args.packageName,
            REGISTRY: args.registry,
            DEVCLASS: args.devclass.toUpperCase()
        }
    });
}