const sktdConstants = require('../sktdConstants');
const { create, writeContent } = require('./xmlGenerator');
const { dateFromAbap } = require('../../../utils/commons');
const { getDevclass } = require('../../../functions');

module.exports = (objName, devclass, connection) => {
    const objectUrl = `${sktdConstants.URL_PREFIX}/${objName.trim().toLowerCase()}`;
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    if(!rfcClient.alive){
        throw new Error('RFC Client connection is not open.');
    }
    return {
        create: async(trkorr) => {
            const user = rfcClient.connectionInfo.user;
            const sid = rfcClient.connectionInfo.sysId;
            //doesn't work, MIW get client and execute
            /*const response = await adtClient.createObject(
                'SKTD/TYP',
                objName.trim().toUpperCase(),
                devclass.trim().toUpperCase(),
                devclassUrl,
                user,
                trkorr
            );*/
            const xml = create({
                objName: objName.trim().toUpperCase(),
                devclass: devclass.trim().toUpperCase(),
                sid: sid,
                user: user
            });
            //atdClient should expose the request client for these type of calls
            //open an issue https://github.com/marcellourbani/abap-adt-api here
            const response = await adtClient.h.request(sktdConstants.URL_PREFIX, {
                body: xml,
                headers: {
                    'Accept': 'application/vnd.sap.adt.sktdv2+xml',
                    'Content-Type': 'application/vnd.sap.adt.sktdv2+xml'
                },
                method: "POST",
                qs: {
                    corrNr: trkorr
                }
            });
            return response;
        },
        lock: async () => {
            const handle = await adtClient.lock(objectUrl, "MODIFY");
            return handle.LOCK_HANDLE;
        },
        unlock: async(lockHandle) => {
            await adtClient.unLock(objectUrl, lockHandle);
        },
        setContent: async (content, lockHandle, trkorr) => {
            var tdevc = await getDevclass(rfcClient, {
                devclass
            });
            tdevc.createdOn = dateFromAbap(tdevc.createdOn);
            const sid = rfcClient.connectionInfo.sysId;
            const user = rfcClient.connectionInfo.user;
            const xml = writeContent({
                sid,
                user,
                tdevc,
                objName,
                content
            });
            await adtClient.setObjectSource(objectUrl, xml, lockHandle, trkorr);
        },
        activate: async() => {
            const response = await adtClient.activate(objName.trim().toLowerCase(), objectUrl);
            return response;
        },
        exists: async() => {
            const response = await adtClient.searchObject(objName.trim().toUpperCase(), 'SKTD');
            return response.length > 0;
        }
    }
}