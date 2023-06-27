const inquirer = require("inquirer");
const { getConnections } = require('../utils/gui');
const { getConnection } = require('../connection');
const { createAlias } = require('./systems');
const Logger = require('../logger');
const { getAliases } = require("../roamingFolder");

module.exports = async (args) => {
    var client;
    const logger = Logger.getInstance();
    const aliases = getAliases();
    const systems = await getConnections();
    var choices = [];
    if(!args.avoidAlias){
        if (aliases.length > 0) {
            choices.push(new inquirer.Separator('----Alias----'));
        }
        aliases.forEach(alias => {
            choices.push({
                name: alias.name,
                value: {
                    type: 'ALIAS',
                    id: alias.name
                }
            });
        });
    }
    if (choices.length > 0) {
        choices.push(new inquirer.Separator('---Systems---'));
    }
    choices = choices.concat(systems.map(system => ({
        name: system.name, value: {
            type: 'GUI',
            id: system.id
        }
    })));
    var prompts = [{
        type: "list",
        message: "Select system",
        name: "system",
        pageSize: aliases && aliases.length >= 3 && aliases.length <= 19 ? aliases.length + 1 : 10,
        choices
    }, {
        type: "input",
        message: "Client",
        name: "client",
        default: "100",
        when: (answersHash) => {
            return answersHash.system.type !== 'ALIAS';
        }
    }, {
        type: "input",
        message: "Username",
        name: "user",
        validate: (inputUsername) => {
            return inputUsername ? true : false
        },
        when: (answersHash) => {
            return answersHash.system.type !== 'ALIAS';
        }
    }, {
        type: "password",
        message: "Password",
        name: "passwd",
        validate: (inputPassword) => {
            return inputPassword ? true : false
        },
        when: (answersHash) => {
            return answersHash.system.type !== 'ALIAS';
        }
    }, {
        type: "input",
        message: "Logon language",
        name: "lang",
        default: 'EN',
        validate: (inputLang) => {
            return inputLang ? true : false
        },
        when: (answersHash) => {
            return answersHash.system.type !== 'ALIAS';
        }
    }];
    if (!args.skipCreateAlias) {
        prompts.push({
            type: "confirm",
            message: "Create new alias for system?",
            name: "createAlias",
            default: true,
            when: (answersHash) => {
                if (answersHash.system.type === 'ALIAS') {
                    return false;
                } else {
                    //check an alias doesn't already exist
                    const system = systems.find(o => o.id === answersHash.system.id);
                    const sSystem = `${system.dest}${system.ashost}${system.sysnr}${answersHash.user.toUpperCase()}${answersHash.passwd}${answersHash.client}${answersHash.lang}`;
                    var aliasExists = false;
                    aliases.forEach(alias => {
                        if (alias.client) {
                            const aliasClient = alias.client;
                            const sAlias = `${aliasClient.dest}${aliasClient.ashost}${aliasClient.sysnr}${aliasClient.user.toUpperCase()}${aliasClient.passwd}${aliasClient.client}${aliasClient.lang}`;
                            if(sSystem === sAlias){
                                aliasExists = true;
                            }
                        }
                    });
                    return !aliasExists;
                }
            }
        });
    }
    const answers = await inquirer.prompt(prompts);

    if (answers.system.type === 'ALIAS') {
        client = aliases.find(o => o.name === answers.system.id).client;
    } else {
        const system = systems.find(o => o.id === answers.system.id);
        client = {
            dest: system.dest,
            user: answers.user.toUpperCase(),
            passwd: answers.passwd,
            client: answers.client,
            lang: answers.lang,
            ashost: system.ashost,
            sysnr: system.sysnr
        };
        if (system.saprouter) {
            client.saprouter = system.saprouter;
        }
    }
    const connection = await getConnection(client);

    if (answers.createAlias) {
        await createAlias(client);
    }
    return connection;
}