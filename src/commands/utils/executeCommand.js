const { getAliasConnection, getConnection } = require("../../connection");
const commands = require('..');
const { authRegistry } = require('../registry');
const { parseError } = require('../../utils/commons');
const Logger = require('../../logger')

module.exports = async (args) => {
    const logger = Logger.getInstance();
    var commandArgs = {};
    if (!args.command) {
        throw new Error('Command not specified');
    }
    var connection;
    var registry;
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
    if(!args.skipRegistry && args.registry){
        registry = await authRegistry(args.registry);
    }else{
        registry = null;
    }
    commandArgs.connection = connection;
    commandArgs.registryData = registry;
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