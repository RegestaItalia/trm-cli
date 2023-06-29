const { getSubpackages, getDevclassObjects, repositoryEnviroment, getTadirEntry, getDevclass } = require('../functions');
const senviParser = require('../dependency/senviParser');
const Logger = require('../logger');
const { getAll } = require('../manifest/utils');

module.exports = async (connection, args) => {
    const logger = Logger.getInstance();
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    const rootDevclass = args.devclass;

    logger.loading("Searching for dependencies...");
    var ret = {
        depencencyManifest: [],
        missingManifest: []
    };

    var allObjects = [];
    var allPackages = [rootDevclass];
    const subpackages = (await getSubpackages(rfcClient, {
        devclass: rootDevclass
    })).map(o => o.devclass);
    allPackages = allPackages.concat(subpackages);
    for (const devclass of allPackages) {
        const objs = await getDevclassObjects(rfcClient, {
            devclass
        });
        allObjects = allObjects.concat(objs.map(o => {
            return {
                object: o.object,
                objName: o.objName
            }
        }));
    }

    var dependencyObjects = [];
    for (const object of allObjects) {
        const re = await repositoryEnviroment(rfcClient, {
            object: object.object,
            objName: object.objName
        });
        for (const senvi of re) {
            var parsedSenvi = null;
            for (const parserKey of Object.keys(senviParser)) {
                if (!parsedSenvi) {
                    try {
                        parsedSenvi = senviParser[parserKey](senvi);
                    } catch (e) {
                        //don't throw
                    }
                }
            }
            if (parsedSenvi) {
                //first check object is not part of root or subpackages
                //it is not a dependency...
                if (!allObjects.find(o => o.object === parsedSenvi.object && o.objName === parsedSenvi.objName)) {
                    //then, check it's not in array already, avoid duplicates
                    if (!dependencyObjects.find(o => o.object === parsedSenvi.object && o.objName === parsedSenvi.objName)) {
                        dependencyObjects.push(parsedSenvi);
                    }
                }
                //force clear
                parsedSenvi = null;
            }
        }
    }
    //with all dependency objects, find their package
    var allManifests = [];
    if (dependencyObjects.length > 0) {
        allManifests = await getAll(connection);
    }
    for (const dependencyObject of dependencyObjects) {
        var skip = false;
        var manifest;
        var depObjDevclass;
        const tadirEntry = await getTadirEntry(rfcClient, {
            pgmid: 'R3TR',
            object: dependencyObject.object,
            objName: dependencyObject.objName
        });
        depObjDevclass = tadirEntry.devclass;
        while (depObjDevclass && !skip) {
            manifest = allManifests.find(o => o.adtObject['adtcore:packageName'] === depObjDevclass);
            if (manifest) {
                depObjDevclass = null;
            } else {
                const tdevc = await getDevclass(rfcClient, {
                    devclass: depObjDevclass
                });
                depObjDevclass = tdevc.parentcl;
                skip = tdevc.pdevclass === 'SAP';
            }
        }
        if(!skip){
            if(!manifest){
                //avoid duplicates, one object per devclass
                if(!ret.missingManifest.find(o => o.devclass === tadirEntry.devclass)){
                    logger.error(`Dependency with object in package ${tadirEntry.devclass}, manifest not found.`);
                    ret.missingManifest.push(tadirEntry);
                }
            }else{
                //avoid duplicates, one object per manifest
                if(!ret.depencencyManifest.find(o => o.adtObject['adtcore:packageName'] === manifest.adtObject['adtcore:packageName'])){
                    logger.info(`Found dependency with package ${manifest.manifest.name}`);
                    ret.depencencyManifest.push(manifest);
                }
            }
        }
    }
    return ret;
}