const { createNewManifest, getAll } = require('../manifest/utils');
const AdmZip = require("adm-zip");
const { registry } = require('../registry');
const Logger = require('../logger');
const inquirer = require("inquirer");
const { setArtifactDevc, getTransportLayer, getDirTrans, getFileSys, getRootPackage, getObjLockTransport } = require('../functions');
const semver = require('semver');
const { getPackageNamespace, getFileSysSeparator } = require('../utils/commons');
const { validateInputPackage, findInstalledPackageManifest, getPackageMap, unpackArtifact, getTransportsData, getSystemUnsupportedTypes, getSystemObjectExist, generateDevc } = require('./utils');
const { importTransport, addObjToTrTryLock } = require('../transport');
const { tadirInterface } = require('../transport/utils');
const fUpdateManifest = require('../manifest/utils/updateManifest');
const getImportTrkorr = require('./utils/getImportTrkorr');
const checkRequirements = require('./utils/checkRequirements');

module.exports = async (args) => {
    const installArtifact = async (args) => {
        const logger = Logger.getInstance();

        const connection = args.connection;
        const packageName = args.arg1;
        const packageVersion = args.version;
        const rfcClient = connection.rfcClient;
        const adtClient = connection.adtClient;
        const registryData = args.registryData;
        const registryInstance = registry(registryData);
    
        //get the artifact from registry and generate zip
        logger.loading('Getting artifact from registry...');
        const artifact = await registryInstance.getArtifact({
            name: packageName,
            version: packageVersion
        });
        const zip = new AdmZip(artifact);
        const installManifest = JSON.parse(zip.getEntry('manifest.json').getData().toString());
        const requirements = installManifest.requirements || [];
        const dependencies = installManifest.dependencies || [];
    
        if (args.requirementsCheck) {
            //before anything, check requirements match
            //if one or more don't ask for confirm
            const mismatchComponents = await checkRequirements(rfcClient, requirements);
            if (mismatchComponents.length > 0) {
                logger.warning(`${mismatchComponents.length} components mismatch. Check table before confirming. Install/Update with mismatch might cause errors later during import phase.`);
                logger.table(['Mismatch', 'Component', 'Release (Install)', 'Release (System)', 'Ext Release (Install)', 'Ext Release (System)'], mismatchComponents);
                const ignoreRequirementsMismatch = await inquirer.prompt({
                    type: "confirm",
                    message: `Ignore ${mismatchComponents.length} components mismatch?`,
                    name: 'continue',
                    default: false
                });
                if (!ignoreRequirementsMismatch.continue) {
                    logger.info(`Installation of ${packageName} aborted.`);
                    return;
                }
            }
        }
    
        if(dependencies.length > 0){
            logger.loading(`This package has ${dependencies.length} dependencies...`);
            const allManifests = await getAll(adtClient);
            var toInstall = [];
            dependencies.forEach(depCheck => {
                const foundManifest = allManifests.find(o => {
                    if(o.manifest.name === depCheck.name){
                        if(o.manifest.registry && o.manifest.registry.address){
                            if(registryInstance.getAddress() === o.manifest.registry.address){
                                return true;
                            }
                        }else{
                            if(registryInstance.getRegistryType() === 'public'){
                                return true;
                            }
                        }
                    }
                });
                if(foundManifest && foundManifest.manifest.version === depCheck.version){
                    logger.info(`Package ${depCheck.name} version ${depCheck.version} already installed.`);
                }else{
                    toInstall.push(depCheck);
                }
            });
            if(toInstall.length > 0){
                logger.warning(`${toInstall.length} dependencies must be installed in order to continue.`);
                const installDependencies = await inquirer.prompt({
                    type: "confirm",
                    message: `${toInstall.length} dependencies will be installed. Continue?`,
                    name: 'continue',
                    default: true
                });
                if (!installDependencies.continue) {
                    logger.info(`Installation of ${packageName} aborted.`);
                    return;
                }
                for(const dependency of toInstall){
                    await installArtifact({
                        ...args,
                        ...{
                            arg1: dependency.name,
                            version: dependency.version
                        }
                    });
                }
            }
        }
    
        //check if install or update
        //find matching manifest compairing name and registry
        logger.loading(`Reading data from ${connection.client.dest}...`);
        const updateManifest = await findInstalledPackageManifest(adtClient, packageName, registryInstance);
        var packageMap = {};
    
        //if matching manifest found, we're not installing but updating
        //it's the same thing, however some default values are defined
        if (updateManifest) {
            var updatePrompt = [];
            var forceQuit;
            if (semver.eq(updateManifest.manifest.version, installManifest.version)) {
                logger.info(`Version ${installManifest.version} already installed.`);
                updatePrompt.push({
                    type: "confirm",
                    message: `Version ${installManifest.version} of package ${packageName} already installed. Continue?`,
                    name: 'continue',
                    default: false
                });
            } else if (semver.gt(updateManifest.manifest.version, installManifest.version)) {
                //TODO here, a deeper check should be done
                //all depentant of this package should be retrieved and the lowest version allowed found
                //if installManifest.version LT lowestAllowedVersion red warning requires a force
                //else, a normal warning of downgrade
                logger.warning(`Downgrading to version ${installManifest.version}.`);
                updatePrompt.push({
                    type: "confirm",
                    message: `ATTENTION! You are downgrading from version ${updateManifest.manifest.version} to ${installManifest.version} of package ${packageName}. This may cause issues, check your dependencies might not be compatible. Continue?`,
                    name: 'continue',
                    default: false
                });
            } else {
                logger.info(`Package ${packageName} will be upgraded from version ${updateManifest.manifest.version} to ${installManifest.version}`);
                forceQuit = false;
            }
    
            if (updatePrompt.length > 0 && args.versionCheck) {
                const updateAnswer = await inquirer.prompt(updatePrompt);
                forceQuit = !updateAnswer.continue;
            }
    
            if (forceQuit) {
                logger.info(`Installation of ${packageName} aborted.`);
                return;
            }
    
            logger.loading('Getting data from previous installation...');
            packageMap = await getPackageMap(rfcClient, packageName, registryInstance);
        }
    
    
        logger.loading('Unpacking artifact...');
        const transports = unpackArtifact(zip);
    
        logger.loading('Reading transport data...');
        const transportData = await getTransportsData(transports);
        var packages = transportData.packages;
        var tdevc = transportData.tdevc;
        var tdevct = transportData.tdevct;
        var objects = transportData.objects;
        packages = packages.sort();
    
        logger.loading('Checking objects existance...');
    
        //here we check all objects of transport are available on the system
        //get all of tadir objects and create a set (no duplicates)
        var objTypes = objects.map(o => o.OBJECT);
        objTypes = [...new Set(objTypes)];
    
        var tableData = await getSystemUnsupportedTypes(adtClient, objTypes);
    
        if (tableData.length > 0) {
            logger.error(`Package cannot be installed. Unsupported objects.`);
            logger.table(['Object'], tableData);
            return;
        }
    
        //here we check objects don't exist before import, otherwise they'd be overwritten
        //they can, however, be overwritten, only if we are in update and it's package is one of the artifact's
        //check this by creating an array of skippable packages (read the package name map from system)
        //loop at tadir in transport and if object exist check it's package is not in the skippable package array
        //also, concat to tadir objects the packages, as they need to be checked too
        const objectsWithDevc = objects.concat(packages.map(s => {
            return {
                OBJ_NAME: s,
                OBJECT: 'DEVC'
            }
        }));
        const objectsAlreadyExist = await getSystemObjectExist(adtClient, packageMap, objectsWithDevc, updateManifest);
        if (objectsAlreadyExist.length > 0) {
            objectsAlreadyExist.forEach(o => tableData.push([o.OBJECT, o.OBJ_NAME]));
            logger.error(`Package cannot be installed. Objects already exist.`);
            logger.table(['Object', 'Name'], tableData);
            return;
        } else {
            logger.success('All objects OK');
        }
    
        //TODO Prefix logic
        //just like abapGit handles it
        //for the time being, ask for user input on every package
    
        var ns;
        var packagePrompts = [];
        var packagesToGenerate = [];
        for (const package of packages) {
            var validatePackage = await validateInputPackage(adtClient, package, ns);
            if (!packageMap[package] || validatePackage.valid !== 4) {
                packagePrompts.push({
                    type: "input",
                    message: `Package ${package} will be generated. Input a new name or press enter to keep it as is`,
                    name: package,
                    validate: async (inputDevclass) => {
                        const finalInputDevclass = inputDevclass || package;
                        validatePackage = await validateInputPackage(adtClient, finalInputDevclass, ns);
                        if (validatePackage.valid === 0) {
                            if (!ns) {
                                ns = getPackageNamespace(finalInputDevclass);
                            }
                        }
                        return validatePackage.inquirerReturn;
                    }
                });
            } else {
                if (!ns) {
                    ns = getPackageNamespace(package);
                }
            }
        }
        if (packagePrompts.length > 0) {
            var packageAnswers = await inquirer.prompt(packagePrompts);
            Object.keys(packageAnswers).forEach(k => {
                if (!packageAnswers[k]) {
                    packageAnswers[k] = k;
                }
                packagesToGenerate.push(packageAnswers[k]);
            })
            packageMap = { ...packageMap, ...packageAnswers };
        }
    
        //update the table containing originalPackage -> installPackage
        logger.loading('Updating package install values...');
        for (const originalPackage of Object.keys(packageMap)) {
            await setArtifactDevc(rfcClient, {
                packageName,
                registryAddress: registryInstance.getAddress(),
                originalDevclass: originalPackage,
                installDevclass: packageMap[originalPackage]
            });
        }
    
        //all checks passed, we can proceed with the actuall install
    
        var transportLayer;
        if (ns !== '$') {
            transportLayer = await getTransportLayer(rfcClient);
        }
        const importTrkorr = await getImportTrkorr(rfcClient, ns, packageName, installManifest.version, registryInstance.getAddress());
    
        //create the packages, with the new name
        logger.loading('Importing packages...');
        await generateDevc({
            rfcClient,
            packages: packagesToGenerate,
            packageMap,
            tdevc,
            tdevct,
            ns,
            transportLayer,
            trkorr: importTrkorr,
            as4user: connection.client.user
        });
    
        //get general data
        logger.loading('Importing objects...');
        const dirTrans = await getDirTrans(rfcClient);
        const fileSys = await getFileSys(rfcClient);
        const pathSeparator = getFileSysSeparator(fileSys);
    
        //import all except devc
        const importTransports = transports.filter(o => o.type !== 'DEVC');
        for (const tr of importTransports) {
            await importTransport({
                rfcClient,
                dirTrans,
                pathSeparator,
                target: connection.client.dest,
                trkorr: tr.trkorr,
                dataFile: tr.dataFile,
                headerFile: tr.headerFile
            });
        }
    
        //if manifest exists, update
        //else generate new -> find root package
        logger.loading('Updating manifest...');
        var manifestObj;
        if (updateManifest) {
            const manifestLocktr = await getObjLockTransport(rfcClient, {
                pgmid: 'R3TR',
                object: updateManifest.adtObject['adtcore:type'].slice(0, 4),
                objName: updateManifest.adtObject['adtcore:name'].toUpperCase(),
            });
            manifestObj = await fUpdateManifest({
                connection,
                trkorr: manifestLocktr || importTrkorr,
                registryAddress: registryInstance.getAddress(),
                manifest: {
                    adtObject: updateManifest.adtObject,
                    manifest: installManifest
                }
            });
        } else {
            //during install we are able to find root package
            //after install, user might change superpackage so this won't work anymore
            var rootPackage;
            for (const key of Object.keys(packageMap)) {
                if (!rootPackage) {
                    rootPackage = await getRootPackage(rfcClient, {
                        package: packageMap[key]
                    });
                }
            }
            if (!rootPackage) {
                throw new Error(`Couldn't find root package.`);
            }
            manifestObj = await createNewManifest({
                connection,
                devclass: rootPackage,
                trkorr: importTrkorr,
                registryAddress: registryInstance.getAddress(),
                manifest: installManifest
            });
        }
    
        objects.push(manifestObj);
    
        //tadir interface
        logger.loading('Finishing import...');
        for (var tadirObject of objects) {
            tadirObject.DEVCLASS = packageMap[tadirObject.DEVCLASS];
            tadirObject.AUTHOR = connection.client.user;
            tadirObject.SRCSYSTEM = connection.client.dest;
            tadirObject.GENFLAG = 'X';
        }
        await tadirInterface(rfcClient, objects);
    
        if (importTrkorr) {
            //add all to transport importTrkorr
            //try to lock, if it fails add without lock
            var objectsInTr = objects;
            Object.keys(packageMap).forEach(key => {
                objectsInTr.push({
                    PGMID: 'R3TR',
                    OBJECT: 'DEVC',
                    OBJ_NAME: packageMap[key]
                });
            });
            for (const objectToAdd of objects) {
                try {
                    await addObjToTrTryLock(rfcClient, importTrkorr, objectToAdd);
                } catch (e) {
                    //don't throw exception
                }
            }
        }
    
        logger.success(`${packageName} v${installManifest.version} installed successfully.`);
    
        if (importTrkorr) {
            logger.info(`Transport ${importTrkorr} contains all objects. Use it to transport to target systems.`);
        }
    }
    return await installArtifact(args);
}