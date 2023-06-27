const { registry } = require('../registry');
const { generateArtifact } = require('../artifact');
const { getPublishedPackages, getSystemCvers, tadirInterface, setArtifactTrkorr, getArtifactTrkorr, getObjLockTransport } = require('../functions');
const inquirer = require("inquirer");
const { validateSem, generateVersion } = require('../utils/sem');
const { getDevclass, getTrTargets, setPublishedPackage } = require('../functions');
const { validateManifest, getAll, updateManifest, createNewManifest } = require('../manifest/utils');
const Logger = require('../logger');
const findDependencies = require('../artifact/findDependencies');
const { getPackageNamespace } = require('../utils/commons');
const getImportTrkorr = require('../artifact/utils/getImportTrkorr');

const getManifestValues = (args) => {
    var packageDefaults = {};

    if (args.hasOwnProperty('description')) {
        packageDefaults.description = args.description;
    }
    if (args.hasOwnProperty('website')) {
        packageDefaults.gitRepository = args.website;
    }
    if (args.hasOwnProperty('repoUrl')) {
        packageDefaults.gitRepository = args.repoUrl;
    }
    if (args.hasOwnProperty('authors')) {
        try {
            packageDefaults.authors = args.authors.split(',');
        } catch (e) {
            packageDefaults.authors = [];
        }
    }
    if (args.hasOwnProperty('keywords')) {
        try {
            packageDefaults.keywords = args.keywords.split(',');
        } catch (e) {
            packageDefaults.keywords = [];
        }
    }
    if (args.hasOwnProperty('license')) {
        packageDefaults.license = args.license;
    }
    return packageDefaults;
}

module.exports = async (args) => {
    const connection = args.connection;
    const packageName = args.arg1;
    const rfcClient = connection.rfcClient;
    const adtClient = connection.adtClient;
    const registryData = args.registryData;
    const logger = Logger.getInstance();
    const registryInstance = registry(registryData);

    var askPrivate;
    var askManifest;
    var private;
    var version;
    if (packageName.length > 100) {
        throw new Error("Package name maximum length is 100");
    }
    if (args.version) {
        version = validateSem(args.version);
    }

    logger.loading("Retrieving data...");
    const allManifests = await getAll(adtClient);
    var generatedManifest = allManifests.find(o => {
        if (o.manifest.name === packageName) {
            if (o.manifest.registry && o.manifest.registry.address) {
                if (registryInstance.getAddress() === o.manifest.registry.address) {
                    return true;
                }
            } else {
                if (registryInstance.getRegistryType() === 'public') {
                    return true;
                }
            }
        }
    });
    var packageDefaults = {};
    const publishedPackages = await getPublishedPackages(rfcClient);
    const publishedPackage = publishedPackages.find(o => o.packageName === packageName && o.registry === registryInstance.getAddress());
    var keepError;
    try {
        const packageView = await registryInstance.view(packageName, 'latest');
        if (packageView.userAuthorizations.canCreateReleases) {
            askManifest = false;
            askPrivate = false;
            private = packageView.private;
            if(args.forceManifest){
                packageDefaults = getManifestValues(args);
            }else{
                packageDefaults.description = packageView.shortDescription;
                packageDefaults.gitRepository = packageView.git;
                packageDefaults.authors = packageView.authors;
                packageDefaults.keywords = packageView.keywords;
                packageDefaults.license = packageView.license;
            }
            if (version && version === res.release.version) {
                keepError = new Error(`Package "${packageName}" version ${version} already published. You can't overwrite a published package version.`);
            }
        } else {
            keepError = new Error(`You are not authorized to publish to "${packageName}".`);
        }
    } catch (e) {
        if (keepError) {
            throw keepError;
        }
        if (generatedManifest) {
            if(!version){
                version = generatedManifest.manifest.version;
            }else{
                generatedManifest.manifest.version = version;
            }
            packageDefaults = generatedManifest.manifest;
        }else{
            packageDefaults = getManifestValues(args);
        }

        if (args.hasOwnProperty('packagePrivate')) {
            private = args.packagePrivate;
        } else {
            askPrivate = true;
        }
        askManifest = true;
        logger.success(`Package "${packageName}" not yet published. Congratulations!`);
    }
    if (!version) {
        version = await generateVersion(registryInstance, packageName);
        logger.info(`Generated version ${version}`);
    } else {
        version = validateSem(version);
    }

    packageDefaults.devclass = generatedManifest ? generatedManifest.adtObject['adtcore:packageName'] : undefined;

    const requiredPrompt1 = [{
        type: "input",
        message: "Devclass",
        name: "devclass",
        default: packageDefaults.devclass,
        validate: (inputDevclass) => {
            if (inputDevclass) {
                const c = inputDevclass.charAt(0);
                if (c === '$') {
                    return 'Temporary packages cannot be released. Move content to a transportable package.'
                } else {
                    return true;
                }
            }
        }
    }];
    const manifestPrompt = [{
        type: "input",
        message: "Package short description",
        name: "description",
        default: packageDefaults.description
    }, {
        type: "input",
        message: "Website",
        name: "website",
        default: packageDefaults.website
    }, {
        type: "input",
        message: "Package Git repository",
        name: "gitRepository",
        default: packageDefaults.gitRepository
    }, {
        type: "input",
        message: "Authors (separated by comma)",
        name: "authors",
        default: packageDefaults.authors && packageDefaults.authors.length > 0 ? packageDefaults.authors.join(', ') : undefined
    }, {
        type: "input",
        message: "Keywords (separated by comma)",
        name: "keywords",
        default: packageDefaults.keywords && packageDefaults.keywords.length > 0 ? packageDefaults.keywords.join(', ') : undefined
    }, {
        type: "input",
        message: "License",
        name: "license",
        default: packageDefaults.license
    }];

    const requiredAnswers1 = await inquirer.prompt(requiredPrompt1);

    const devclass = requiredAnswers1.devclass.trim().toUpperCase();
    if (publishedPackage && publishedPackage.devclass !== devclass) {
        //package changed after publish
        //move manifest to this new package
        logger.info(`Package changed, original publish package was ${publishedPackage.devclass}`);
        if (generatedManifest) {
            await tadirInterface(rfcClient, {
                pgmid: 'R3TR',
                object: generatedManifest.adtObject['adtcore:type'].substring(0, 4),
                objName: generatedManifest.adtObject['adtcore:name'],
                devclass
            });
        }
    } else {
        if (publishedPackages.find(o => o.devclass === devclass && !(o.packageName === packageName && o.registry === registryInstance.getAddress()))) {
            throw new Error(`Devclass ${devclass} already contains another package.`);
        }
    }

    const devclassObj = await getDevclass(rfcClient, {
        devclass
    });

    const trTargets = await getTrTargets(rfcClient);

    var requiredPrompt2 = [{
        type: "list",
        message: "Transport target",
        name: "trTarget",
        default: devclassObj.consys,
        choices: trTargets.map(o => ({ name: `${o.sysnam} (${o.systxt})`, value: o.sysnam }))
    }];
    if (askPrivate) {
        requiredPrompt2.push({
            type: "confirm",
            message: "Make repository private",
            name: "private",
            default: false
        });
    }

    const requiredAnswers2 = await inquirer.prompt(requiredPrompt2);
    if (askPrivate) {
        private = requiredAnswers2.private;
    }

    //ask manifest infos only if first ever publish or packageSip is false and previous values were retrieved
    var packageManifest;
    if (askManifest) {
        packageManifest = await inquirer.prompt(manifestPrompt);
        packageManifest.name = packageName;
        packageManifest.version = version;
        packageManifest.private = private;
        packageManifest = validateManifest(packageManifest);
    }

    const trTarget = requiredAnswers2.trTarget;

    const foundDependencies = await findDependencies(connection, {
        devclass
    });


    if (foundDependencies.missingManifest.length > 0 && !args.missingDependencyBypass) {
        throw new Error(`Found ${foundDependencies.missingManifest.length} missing dependency packages. All dependencies must also have a package in registry ${registryInstance.getName()}.`);
    }
    if (foundDependencies.depencencyManifest.length > 0) {
        //if we're publishing in public registry, all dependencies must be in public registry, not private
        //if we're publishing to private registry, registry address match
        foundDependencies.depencencyManifest.forEach(o => {
            const dependencyManifest = o.manifest;
            if (dependencyManifest.registry && dependencyManifest.registry.address) {
                if (registryInstance.getRegistryType() === 'public') {
                    throw new Error(`Dependency with package "${dependencyManifest.name}" in private registry not allowed.`);
                } else {
                    if (registryInstance.getAddress() !== dependencyManifest.registry.address) {
                        throw new Error(`Dependency with package "${dependencyManifest.name}" in different registry not allowed.`);
                    }
                }
            } else {
                if (registryInstance.getRegistryType() === 'public' && dependencyManifest.private) {
                    throw new Error(`Dependency with private package "${dependencyManifest.name}" not allowed.`);
                }
            }
        });
    }

    logger.success(`Found ${foundDependencies.depencencyManifest.length} dependencies.`);

    const ns = getPackageNamespace(devclass);
    var trkorr;
    if (generatedManifest) {
        trkorr = await getObjLockTransport(rfcClient, {
            pgmid: 'R3TR',
            object: generatedManifest.adtObject['adtcore:type'].substring(0, 4),
            objName: generatedManifest.adtObject['adtcore:name']
        });
    } else {
        trkorr = await getImportTrkorr(rfcClient, ns, packageName, version, registryInstance.getAddress(), true);
    }
    if (ns !== '$' && !trkorr) {
        const trkorrResponse = await inquirer.prompt([{
            type: "input",
            message: "Insert trkorr for manifest generation",
            name: "trkorr"
        }]);
        logger.loading("Checking transport request...");
        await setArtifactTrkorr(rfcClient, {
            packageName,
            registryAddress: registryInstance.getAddress(),
            trkorr: trkorrResponse.trkorr
        });
        //after write get it back, this is to check tr actually exists
        trkorr = await getArtifactTrkorr(rfcClient, {
            packageName,
            registryAddress: registryInstance.getAddress()
        });
        if (!trkorr) {
            throw new Error('Invalid transport request.');
        }
    }

    const artifact = await generateArtifact(connection, {
        devclass,
        name: packageName,
        version,
        trTarget
    });

    logger.loading("Publishing...");

    //get system version for requirements
    const cvers = await getSystemCvers(rfcClient);

    await registryInstance.publish(artifact, {
        ...packageManifest, ...{
            packageName,
            version,
            private: private ? true : false,
            distPath: 'dist',
            cvers,
            dependencies: foundDependencies.depencencyManifest.map(o => {
                return {
                    name: o.manifest.name,
                    version: o.manifest.version
                }
            })
        }
    });

    await setPublishedPackage(rfcClient, {
        packageName,
        registry: registryInstance.getAddress(),
        devclass
    });

    //create or update manifest object
    //we also create the manifest object in this stage because we need to be able to transport this to targets
    logger.loading("Updating manifest...");
    if (generatedManifest) {
        generatedManifest.manifest = packageManifest;
        await updateManifest({
            connection,
            trkorr,
            registryAddress: registryInstance.getAddress(),
            manifest: generatedManifest
        });
    } else {
        await createNewManifest({
            connection,
            trkorr,
            devclass,
            registryAddress: registryInstance.getAddress(),
            manifest: packageManifest
        });
    }

    logger.success(`Package "${packageName}" published to registry.`);
}