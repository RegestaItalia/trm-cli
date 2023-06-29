const { createPackage } = require("../../functions");
const { tadirInterface } = require("../../transport/utils");

module.exports = async(args) => {
    const rfcClient = args.rfcClient;
    const packages = args.packages;
    const packageMap = args.packageMap;
    const tdevc = args.tdevc;
    const tdevct = args.tdevct;
    const ns = args.ns;
    const transportLayer = args.transportLayer;
    const trkorr = args.trkorr;
    const as4user = args.as4user;
    for (const package of packages) {
        //package description inside trContent
        const originalPackageName = Object.keys(packageMap).find(key => packageMap[key] === package);
        const originalDevc = tdevc.find(o => o.DEVCLASS === originalPackageName);
        var parentcl;
        if (originalDevc.PARENTCL) {
            parentcl = packageMap[originalDevc.PARENTCL];
        }
        const originalDevct = tdevct.find(o => o.DEVCLASS === originalPackageName);
        await createPackage(rfcClient, {
            devclass: package,
            dlvunit: ns === '$' ? 'LOCAL' : 'HOME',
            parentcl,
            pdevclass: transportLayer,
            ctext: originalDevct.CTEXT,
            trkorr: trkorr,
            as4user: as4user
        });
        if(ns !== '$'){
            await tadirInterface(rfcClient, [{
                PGMID: 'R3TR',
                OBJECT: 'DEVC',
                OBJ_NAME: package,
                GENFLAG: 'X'
            }]);
        }
    }
}