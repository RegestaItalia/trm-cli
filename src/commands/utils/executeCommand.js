const { getAliasConnection, getConnection } = require("../../connection");
const commands = require('..');
const { pickRegistry, printMessage } = require('../registry');
const { parseError } = require('../../utils/commons');
const Logger = require('../../logger');
const { getRegistryList } = require("../../roamingFolder");
const { registry } = require("../../registry");

module.exports = async (args) => {
    const logger = Logger.getInstance();
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
    } else {
        connection = null;
    }
    if(!args.skipRegistry){
        var registryName = args.registry;
        const registryList = getRegistryList();
        if(registryName){
            registryData = registryList.find(o => o.name === registryName);
            if (!registryData) {
                throw new Error(`Registry "${registryName}" not defined in ini file.`);
            }
        }else{
            if(registryList.length === 1){
                registryData = registryList[0];
            }else{
                registryData = await pickRegistry(registryList);
            }
        }
        const registryInstance = registry(registryData);
        const ping = await registryInstance.ping();
        if(ping.wallMessage){
            printMessage(ping.wallMessage);
        }
    }else{
        registryData = null;
    }
    commandArgs.connection = connection;
    commandArgs.registryData = registryData;
    var exitCode;
    try{
        await commands[args.command]({ ...commandArgs, ...args });
        exitCode = 0;
    }catch(e){
        logger.error(parseError(e));
        exitCode = 1;
    }finally{
        if(connection){
            connection.adtClient.dropSession();
            connection.rfcClient.close();
        }
        process.exit(exitCode);
    }
}