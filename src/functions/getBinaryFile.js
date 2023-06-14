module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_GET_BINARY_FILE", {
        IV_FILE_PATH: args.filePath
    });
    return rfcResult.EV_FILE;
}