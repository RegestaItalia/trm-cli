const { writeBinaryFile, forwardRequest, importTr } = require('../functions');
const { getFileNames, isInTmsQueue } = require('./utils');
const Logger = require('../logger');

module.exports = async (args) => {
    const logger = Logger.getInstance();

    const rfcClient = args.rfcClient;
    const dirTrans = args.dirTrans;
    const pathSeparator = args.pathSeparator;
    const trkorr = args.trkorr;
    const dataFile = args.dataFile;
    const headerFile = args.headerFile;
    const target = args.target;


    const fileNames = getFileNames(trkorr);
    const headerFileName = fileNames.headerFileName;
    const dataFileName = fileNames.dataFileName;

    const headerFilePath = `${dirTrans}${pathSeparator}cofiles${pathSeparator}${headerFileName}`;
    const dataFilePath = `${dirTrans}${pathSeparator}data${pathSeparator}${dataFileName}`;
    
    await writeBinaryFile(rfcClient, {
        filePath: headerFilePath,
        file: headerFile
    });
    await writeBinaryFile(rfcClient, {
        filePath: dataFilePath,
        file: dataFile
    });

    await forwardRequest(rfcClient, {
        trkorr,
        target,
        source: target
    });

    await importTr(rfcClient, {
        trkorr,
        system: target
    });

    await isInTmsQueue(rfcClient, trkorr, target);
}