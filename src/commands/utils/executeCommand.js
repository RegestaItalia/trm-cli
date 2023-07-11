const { getAliasConnection, getConnection } = require("../../connection");
const commands = require('..');
const { pickRegistry, printMessage } = require('../registry');
const { parseError } = require('../../utils/commons');
const Logger = require('../../logger');
const { getRegistryList } = require("../../roamingFolder");
const { registry } = require("../../registry");
const { checkTrmDependencies } = require("../../utils");

module.exports = async (args) => {
    const logger = Logger.getInstance();
    var exitCode;
    try {
        var commandArgs = {};
        if (!args.command) {
            throw new Error('Command not specified');
        }
        var connection;
        var registryData;
        if (!args.skipConnection) {
            var client = {
                dest: args.dest,
                user: args.user,
                passwd: args.passwd,
                client: args.client,
                lang: args.lang,
                ashost: args.ashost,
                sysnr: args.sysnr
            }
            if (!client.dest || !client.user || !client.passwd || !client.client || !client.lang || !client.ashost || !client.sysnr) {
                if (args.systemAlias) {
                    connection = await getAliasConnection(args.systemAlias);
                } else {
                    const skipCreateAlias = args.skipCreateAlias ? true : false;
                    connection = await commands['pickSystem']({
                        skipCreateAlias
                    });
                }
            } else {
                if (args.systemAlias) {
                    throw new Error('Both alias and direct system connection are specified. This is not allowed.');
                } else {
                    connection = await getConnection(client);
                }
            }
            if(!args.skipTrmDependencies){
                const trmDependencies = await checkTrmDependencies(connection);
                if (trmDependencies.missingPackages.length > 0) {
                    throw new Error(`Required dependencies ${trmDependencies.missingPackages.map(o => o.name).join(', ')} missing in system ${connection.client.dest}.`);
                }
                if (trmDependencies.mismatchPackages.length > 0) {
                    trmDependencies.mismatchPackages.forEach(o => {
                        logger.warning(`Package ${o.name}, version ${o.installedVersion}, in system ${connection.client.dest} doesn't meet dependency requirement ${o.range}. Upgrade to avoid unexpected errors.`)
                    });
                }
            }
        } else {
            connection = null;
        }
        if (!args.skipRegistry) {
            var registryName = args.registry;
            const registryList = getRegistryList();
            if (registryName) {
                registryData = registryList.find(o => o.name === registryName);
                if (!registryData) {
                    throw new Error(`Registry "${registryName}" not defined in ini file.`);
                }
            } else {
                if (registryList.length === 1) {
                    registryData = registryList[0];
                } else {
                    registryData = await pickRegistry(registryList);
                }
            }
            const registryInstance = registry(registryData);
            const ping = await registryInstance.ping();
            if (ping.wallMessage) {
                printMessage(ping.wallMessage);
            }
        } else {
            registryData = null;
        }
        commandArgs.connection = connection;
        commandArgs.registryData = registryData;
        await commands[args.command]({ ...commandArgs, ...args });
        exitCode = 0;
    } catch (e) {
        logger.error(parseError(e));
        exitCode = 1;
    } finally {
        if (connection) {
            connection.adtClient.dropSession();
            connection.rfcClient.close();
        }
        process.exit(exitCode);
    }
}