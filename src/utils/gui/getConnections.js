const { xmlToJs, getRoamingFolder } = require('../commons');
const fs = require('fs');

module.exports = async () => {
    const roamingDir = getRoamingFolder();
    const sXml = fs.readFileSync(`${roamingDir}\\SAP\\Common\\SAPUILandscape.xml`, { encoding: 'utf8', flag: 'r' });
    const result = await xmlToJs(sXml);
    var systems = [];
    try {
        result.Landscape.Services[0].Service.forEach((xmlObj) => {
            var obj = xmlObj['$'];
            var addrMatches = obj.server.match(/(.*)\:(\d*)$/);
            var ashost = addrMatches[1];
            var port = addrMatches[2];
            var sysnr = port.slice(-2);
            var saprouter;
            if (obj.routerid) {
                const router = result.Landscape.Routers[0].Router.find((o) => o['$'].uuid === obj.routerid);
                if (router) {
                    saprouter = router['$'].router;
                }
            }
            systems.push({
                id: obj.uuid,
                name: obj.name,
                dest: obj.systemid,
                sysnr,
                ashost,
                saprouter
            });
        });
    } catch (e) { }
    return systems;
}