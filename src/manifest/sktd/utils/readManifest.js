const getObjUrl = require('./getObjUrl');
const { xmlToJs } = require('../../../utils/commons');

module.exports = async (objName, objUrl, adtClient) => {
    //const url = getObjUrl(objName);
    const url = objUrl;
    const source = await adtClient.getObjectSource(url);
    const xml = await xmlToJs(source);
    const base64 = xml['sktd:docu']['sktd:element'][0]['sktd:text'][0];
    const json = Buffer.from(base64.toString('utf8'), 'base64').toString('ascii');
    const sktdManifest = JSON.parse(json);
    return sktdManifest;
}