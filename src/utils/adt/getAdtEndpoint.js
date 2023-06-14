const { getAdtDiscovery } = require("../../functions");
const { xmlToJs } = require("../commons");

const _fallbackFindUrl = (str) => {
    const matches = /(https|http):\/\/([^:]*):(\d+)\/sap/gm.exec(str);
    try{
        return {
            protocol: matches[1].toLowerCase(),
            address: matches[2].toLowerCase(),
            port: matches[3]
        }
    }catch(e){
        throw new Error('ADT endpoint not found.');
    }
}
module.exports = async (rfcClient) => {
    var oRet = {};
    var sXml;
    try {
        sXml = await getAdtDiscovery(rfcClient);
    } catch (e) {
        throw new Error('ADT not available on the system.');
    }
    const xml = await xmlToJs(sXml);
    var oXmlHttpEndpoint;
    var oXmlHttpEndpointStateful;
    const service = xml['app:service'] || {};
    const items = service['app:workspace'] || [];
    items.forEach(item => {
        if (item['app:collection']) {
            item['app:collection'].forEach(itemCollection => {
                if (itemCollection['atom:category']) {
                    itemCollection['atom:category'].forEach(itemCategory => {
                        if (itemCategory['$']) {
                            const category = itemCategory['$'].term;
                            if (category === 'httpendpoint') {
                                oXmlHttpEndpoint = itemCollection;
                            } else if (category === 'httpendpointStateful') {
                                oXmlHttpEndpointStateful = itemCollection;
                            }
                        }
                    });
                }
            });
        }
    });
    try {
        if (oXmlHttpEndpoint) {
            const httpEndpoint = oXmlHttpEndpoint['$'].href;
            const httpEndpointMatches = /(https|http):\/\/(.*):(\d+)\/?(.*)$/gmi.exec(httpEndpoint);
            oRet.httpEndpoint = {
                protocol: httpEndpointMatches[1].toLowerCase(),
                address: httpEndpointMatches[2].toLowerCase(),
                port: httpEndpointMatches[3]
            }
        } else {
            oRet.httpEndpoint = _fallbackFindUrl(sXml);
        }
    } catch (e) { }
    try {
        const httpStatefulEndpoint = oXmlHttpEndpointStateful['$'].href;
        if (httpStatefulEndpoint) {
            const httpStatefulEndpointMatches = /(https|http):\/\/(.*):(\d+)\/?(.*)$/gmi.exec(httpStatefulEndpoint);
            oRet.httpStatefulEndpoint = {
                protocol: httpStatefulEndpointMatches[1].toLowerCase(),
                address: httpStatefulEndpointMatches[2].toLowerCase(),
                port: httpStatefulEndpointMatches[3]
            }
        }
    } catch (e) { }
    return oRet;
}