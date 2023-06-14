# <a href="https://trmregistry.regestaitalia.it/"><img src="img/logo.png" height="40" alt="logo"></a>
![NPM](https://img.shields.io/npm/l/trm-client)
![npm](https://img.shields.io/npm/v/trm-client)
![npm](https://img.shields.io/npm/dt/trm-client)

TRM is the first ABAP package manager.

Composed of a client side CLI software and a server side ABAP package, it essentially allows you to move packages from system A to system B, maintaining versioning, dependencies and system requirements.

It relies on a registry, where the packages are stored and ready to be downloaded at any time.

## Supported systems
- Windows

## Requirements
- [NodeJs & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-nodejs-and-npm)
- [TRM Server-Side](https://github.com/RegestaItalia/trm-server#installation) package on your development system (first install via abapGit)
- ADT services available on your systems
- [SAP NW RFC SDK](https://github.com/SAP/node-rfc/blob/main/doc/installation.md#sap-nwrfc-sdk-installation) locally installed
- [R3Trans program](https://github.com/RegestaItalia/node-r3trans#installation) locally installed

## Installation
```
🛈 Before installing trm-client, check that all the requirements are met.
```

Install is done with npm
```
npm install trm-client -g
```

After install, executing the command
```
trm --help
```
should output the list of possible commands with a short description.

## Usage
A tutorial that will get you started using TRM, can be found [here](https://blogs.sap.com/?p=1768661).
Full description of each command can also be seen using
```
trm [command] --help
```

### Connecting to a system
There are three different ways to run commands that require connection to a system:
- Direct connection
- Alias
- Prompt

To use direct connection, you must specify all of these options to your command:
```
  -d, --dest <dest>                System Destination
  -u, --user <user>                System User Logon
  -p, --passwd <passwd>            System User Logon Password
  -c, --client <client>            System Client
  -l, --lang <lang>                System User Logon Language
  -h, --ashost <ashost>            System address
  -n, --sysnr <sysnr>              System number
```
To use an alias, you first create one with the command:
```
trm createAlias
```
(alternatively, you can manually add an alias into the **trm/config.json** file in your roaming folder).
With an alias defined, run your command with the option
```
-a, --systemAlias <systemAlias>
```
If none of these methods are specified, you will be prompted for a system connection each time.

### Check installed package
The first trm package you should have in your development system is [trm-server](https://github.com/RegestaItalia/trm-server).
You first install it with [abapGit](https://abapgit.org/), but then it's fully TRM compatible.

Try running this command:
```
trm view trm-server
```
You should see informations about the trm-server version you have installed.

### Installing a package


### Publishing your first package
Publishing a package is as easy as running this command:
```
trm publish <package_name>
```

## Registry
### Public registry
trm-client defaults all registry related commands to the default registry.

All packages published on the public registry can be seen [here](https://trmregistry.regestaitalia.it/).

If you wish to publish a package to the public registry or access private packages, you will need to create an account and log in.

### Private registry
You can define as many private registries as you want.

## FAQ
For any question regarding trm-client, you can open an issue.
Before opening an issue, check if it's trm-client related: all other issues should be opened in their respective GitHub repos,