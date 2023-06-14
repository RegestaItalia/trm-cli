const { getDevclassObjects, createToc, addObjectsToTr, releaseTr, dequeueTr, getBinaryFile } = require('../functions');
const { getFileNames, isInTmsQueue } = require('./utils');
const { manifestConstants } = require('../manifest');
const AdmZip = require("adm-zip");
const Logger = require('../logger');

module.exports = async (args) => {
    const rfcClient = args.rfcClient;
    const target = args.target;
    const packages = args.packages;
    const dirTrans = args.dirTrans;
    const pathSeparator = args.pathSeparator;
    const description = args.description;
    const filter = args.filter;
    const logger = Logger.getInstance();

    var allObjects = [];
    logger.loading('Reading objects...');
    for (const package of packages) {
        var devcObjects = await getDevclassObjects(rfcClient, {
            devclass: package
        });
        if (filter === 'NODEVC') {
            devcObjects = devcObjects.filter(o => o.object !== 'DEVC');
        } else if (filter === 'ONLYDEVC') {
            devcObjects = devcObjects.filter(o => o.object === 'DEVC');
        }
        //always skip manifest if it exists (could be publish from non original system)
        devcObjects = devcObjects.filter(o => !((o.object === 'INTF' || o.object === 'SKTD') && new RegExp(`^(?:Z|Y|\\/\\w*\\/)${manifestConstants.OBJ_PREFIX}\\d*$`, 'g').test(o.objName)));
        allObjects = allObjects.concat(devcObjects);
    }
    logger.info(`Found ${allObjects.length} objects`);
    logger.loading(`Creating transport...`);
    const trkorr = await createToc(rfcClient, {
        text: description,
        target
    });
    const addObjLog = await addObjectsToTr(rfcClient, {
        trkorr,
        objs: allObjects
    });
    logger.success(`Transport created`);

    logger.loading(`Releasing...`);
    
    const releaseLog = await releaseTr(rfcClient, {
        trkorr
    });
    await dequeueTr(rfcClient, {
        trkorr
    });

    await isInTmsQueue(rfcClient, trkorr, target);

    const fileNames = getFileNames(trkorr);
    const headerFileName = fileNames.headerFileName;
    const dataFileName = fileNames.dataFileName;

    const headerFilePath = `${dirTrans}${pathSeparator}cofiles${pathSeparator}${headerFileName}`;
    const dataFilePath = `${dirTrans}${pathSeparator}data${pathSeparator}${dataFileName}`;

    logger.loading(`Reading binary files...`);
    const headerFile = await getBinaryFile(rfcClient, {
        filePath: headerFilePath
    });
    const dataFile = await getBinaryFile(rfcClient, {
        filePath: dataFilePath
    });

    const trkorrZip = new AdmZip();
    trkorrZip.addZipComment(trkorr);
    trkorrZip.addFile(headerFileName, headerFile, "header");
    trkorrZip.addFile(dataFileName, dataFile, "data");
    const buffer = await trkorrZip.toBufferPromise();

    logger.success('Success');

    return {
        trkorr,
        artifact: buffer
    }
}