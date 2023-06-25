#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const { registerCommand } = require('./commands/utils');

program
    .name('trm')
    .description('TRM - Transport Request Manager CLI')
    .version('1.0.0');

const info = program.command('info')
    .description('Get TRM infos');

const createAlias = program.command('createAlias')
    .description('Create alias for a system');

const listPackages = program.command('ls')
    .description('List all packages installed into system');

const addRegistry = program.command('addRegistry <name>')
    .description('Add a new registry')
    .option('-a, --address <address>', 'Registry address', undefined)
    .option('-u, --username <username>', 'Registry username', undefined)
    .option('-p, --password <password>', 'Registry password', undefined);


const profile = program.command('profile')
    .description('Change user profile parameter for registry');

const viewPackage = program.command('view <name>')
    .description('View installed package info')
    .option('-dc, --dependencies-check', 'Check dependencies', true);

const publish = program.command('publish <package>')
    .description('Publish package to repository')
    .option('-d, --devclass <devclass>', 'System devclass name. Defaults to latest used', undefined)
    .option('-v, --version <version>', 'Version to publish. Defaults to 0.0.1 if published fot the first time or increases patch number of latest release', undefined)
    .option('-t, --target <target>', 'TMS Target', undefined)
    .option('-pp, --package-private', 'Publish package as a private', false)
    .option('-pd, --package-description <description>', 'Package description', undefined)
    .option('-pg, --package-website <website>', 'Project website', undefined)
    .option('-pg, --package-git-repository <repoUrl>', 'Package repository url', undefined)
    .option('-pa, --package-authors <authors>', 'Package authors in the form of \'Name\ <email>\', separated by comma', undefined)
    .option('-pk, --package-keywords <keywords>', 'Package keywords, separated by comma', undefined)
    .option('-pl, --package-license <license>', 'Package license', undefined)
    .option('-mdb, --missing-dependency-bypass', 'Bypass abort with missing dependency ', false)

const install = program.command('install <package>')
    .description('Install package to system')
    .option('-v, --version <version>', 'Package version to install', 'latest')
    .option('-rs, --requirements-check', 'Check requirements', true)
    .option('-vc, --version-check', 'Compare installed version', true);

registerCommand(info, {
    skipCreateAlias: true,
    skipRegistry: true
});

registerCommand(createAlias, {
    skipCreateAlias: true,
    skipUseAlias: true,
    skipRegistry: true
});

registerCommand(listPackages, {
    skipRegistry: true
});

registerCommand(addRegistry, {
    skipRegistry: true,
    skipConnection: true
});

registerCommand(viewPackage, {
    skipRegistry: true
});

registerCommand(profile, {
    skipConnection: true
});

registerCommand(publish);

registerCommand(install);

program.parse(process.argv);