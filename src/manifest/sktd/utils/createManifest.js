const { wrapper } = require('../wrapper');
const removeAllLocks = require('./removeAllLocks');

module.exports = async(args) => {
    const connection = args.connection;
    const rfcClient = connection.rfcClient;
    const objName = args.objName;
    const devclass = args.devclass;
    const trkorr = args.trkorr;
    const manifest = args.manifest;
    
    const sktdHelper = wrapper(objName, devclass, connection);
    
    const exists = await sktdHelper.exists();
    if(exists){
        throw new Error(`Can't create manifest ${objName} because it already exists.`);
    }

    await sktdHelper.create(trkorr);
    await removeAllLocks(rfcClient);
    const lockHandle = await sktdHelper.lock();
    await sktdHelper.setContent(JSON.stringify(manifest, null, 2), lockHandle, trkorr);
    
    await sktdHelper.unlock(lockHandle);
    await sktdHelper.activate();
}