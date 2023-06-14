module.exports = async(rfcClient, args) => {
    const rfcResult = await rfcClient.call("ZTRM_WRITE_BINARY_FILE", {
        IV_FILE_PATH: args.filePath,
        IV_FILE: args.file
    });
}