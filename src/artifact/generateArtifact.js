const AdmZip = require("adm-zip");
const { getDirTrans, getFileSys, getSubpackages, getSourceCode } = require('../functions');
const { getFileSysSeparator, getTrmVersion } = require('../utils/commons');
const { generateTadirTransport } = require('../transport');
const Logger = require('../logger');

module.exports = async (connection, args) => {
    const artifact = new AdmZip();
    artifact.addZipComment(`TRM Package\nGenerator version: ${getTrmVersion()}`);

    const logger = Logger.getInstance();
    const rfcClient = connection.rfcClient;
    const devclass = args.devclass;
    //const manifest = args.manifest;
    //const packageName = manifest.name;
    const packageName = args.name;
    //const version = manifest.version;
    const version = args.version;
    const target = args.trTarget;
    const transportDescription = `TRM: ${packageName} v${version}`;

    //artifact.addFile(`manifest.json`, JSON.stringify(manifest, null, 2), "manifest");

    //save source code (abapGit)
    try {
        const sourceCode = await getSourceCode(rfcClient, {
            devclass
        });
        const sourceCodeZip = new AdmZip(sourceCode);
        sourceCodeZip.getEntries().forEach(entry => {
            //no more src folder -> easier install via abapGit of artifact
            artifact.addFile(`${entry.entryName}`, entry.getData(), "Serialized by abapGit");
        });
    } catch (e) {
        logger.warning('Source code was not generated (is abapGit installed?)');
    }

    //get general data
    const dirTrans = await getDirTrans(rfcClient);
    const fileSys = await getFileSys(rfcClient);
    const pathSeparator = getFileSysSeparator(fileSys);

    //get subpackages
    var packages = [devclass];
    const subpackages = await getSubpackages(rfcClient, {
        devclass
    });
    packages = packages.concat(subpackages.map(o => o.devclass));
    const genTrArgs = {
        rfcClient,
        target,
        packages,
        dirTrans,
        pathSeparator
    };

    //generate tadir tr for root and subpackages
    const tadirTransport = await generateTadirTransport({...genTrArgs, ...{
        description: transportDescription,
        filter: 'NODEVC'
    }});
    artifact.addFile(`dist/${tadirTransport.trkorr}`, tadirTransport.artifact, "TADIR");
    
    //generate devc tr (used to keep track of packages, will not be imported!)
    const devcTransport = await generateTadirTransport({...genTrArgs, ...{
        description: `${transportDescription} - Do not import!`,
        filter: 'ONLYDEVC'
    }});
    artifact.addFile(`dist/${devcTransport.trkorr}`, devcTransport.artifact, "DEVC");

    logger.success('Artifact generated successfully');
    
    return await artifact.toBufferPromise();
}