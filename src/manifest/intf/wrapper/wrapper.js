const { writeContent } = require('./intfGenerator');

module.exports = (objName, devclass, connection) => {
    const objectUrl = `/sap/bc/adt/oo/interfaces/${objName.trim().toLowerCase()}`;
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    if(!rfcClient.alive){
        throw new Error('RFC Client connection is not open.');
    }
    return {
        create: async(trkorr) => {
            await adtClient.createObject({
                description: 'TRM Manifest',
                name: objName,
                objtype: 'INTF/OI',
                parentName: devclass,
                parentPath: `/sap/bc/adt/packages/${devclass.toLowerCase()}`
            });
        },
        lock: async () => {
            const handle = await adtClient.lock(objectUrl, "MODIFY");
            return handle.LOCK_HANDLE;
        },
        unlock: async(lockHandle) => {
            await adtClient.unLock(objectUrl, lockHandle);
        },
        setContent: async (content, lockHandle, trkorr) => {
            const intfSourceCode = writeContent(
                objName,
                content
            );
            await adtClient.setObjectSource(`${objectUrl}/source/main`, intfSourceCode, lockHandle, trkorr);
        },
        activate: async() => {
            const response = await adtClient.activate(objName.trim().toLowerCase(), objectUrl);
            return response;
        },
        exists: async() => {
            const response = await adtClient.searchObject(objName.trim().toUpperCase(), 'INTF');
            return response.length > 0;
        }
    }
}