const { wrapper } = require('../wrapper');
const removeAllLocks = require('./removeAllLocks');

module.exports = async(args) => {
    const connection = args.connection;
    const rfcClient = connection.rfcClient;
    const objName = args.objName;
    const devclass = args.devclass;
    const trkorr = args.trkorr;
    const manifest = args.manifest;

    const intfHelper = wrapper(objName, devclass, connection);
    
    const exists = await intfHelper.exists();
    if(!exists){
        throw new Error(`${objName} doesn't exists.`);
    }

    await removeAllLocks(rfcClient);
    const lockHandle = await intfHelper.lock();
    await intfHelper.setContent(manifest, lockHandle, trkorr);
    
    await intfHelper.unlock(lockHandle);
    await intfHelper.activate();
}