const { removeManifestLocks } = require("../../../functions")

module.exports = async (rfcClient) => {
    await removeManifestLocks(rfcClient, {
        objType: 'INTF'
    })
}