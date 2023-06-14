const executeCommand = require('./executeCommand');
const { Command } = require('commander');
const Logger = require('../../logger');

module.exports = (command, args) => {
    const commandName = command.name();
    if(!args){
        args = {};
    }
    if(!args.skipConnection){
        command.option('-d, --dest <dest>', 'System Destination')
        .option('-u, --user <user>', 'System User Logon')
        .option('-p, --passwd <passwd>', 'System User Logon Password')
        .option('-c, --client <client>', 'System Client')
        .option('-l, --lang <lang>', 'System User Logon Language')
        .option('-h, --ashost <ashost>', 'System address')
        .option('-n, --sysnr <sysnr>', 'System number');
        if(!args.skipUseAlias){
            command.option('-a, --systemAlias <systemAlias>', 'System Alias');
        }
    }
    if(!args.skipRegistry){
        command.option('-r, --registry <registry>', 'Package registry', 'public');
    }
    command.option('-log, --log-type', 'Log type', 'cli');

    command.action(async (arg1, options) => {
        if(options instanceof Command){
            options = arg1;
            arg1 = undefined;
        }
        Logger.create(options.logType);
        await executeCommand({
            ...args,
            ...{
                command: commandName,
                arg1
            },
            ...options,
        });
    });
}