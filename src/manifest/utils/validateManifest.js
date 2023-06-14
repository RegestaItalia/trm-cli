const { validateSem } = require("../../utils/sem");
const validateAuthors = require("./validateAuthors");
const validateKeywords = require("./validateKeywords");
const validateUrl = require('./validateUrl');
const { normalizeUrl } = require('../../utils/commons');

const _moveCheck = (mapping) => {
    if(mapping.from[mapping.property] && typeof mapping.from[mapping.property] === mapping.type){
        var value = mapping.from[mapping.property];
        if(mapping.type === 'string'){
            value = value.trim();
        }
        mapping.to[mapping.property] = value;
    }
}

module.exports = (arg) => {
    var manifest = {};
    var mappings = [{
        from: arg,
        to: manifest,
        property: 'name',
        type: 'string'
    }, {
        from: arg,
        to: manifest,
        property: 'version',
        type: 'string'
    }, {
        from: arg,
        to: manifest,
        property: 'description',
        type: 'string'
    }, {
        from: arg,
        to: manifest,
        property: 'gitRepository',
        type: 'string'
    }, {
        from: arg,
        to: manifest,
        property: 'website',
        type: 'string'
    }, {
        from: arg,
        to: manifest,
        property: 'license',
        type: 'string'
    }];
    var registry = arg.registry;
    mappings.forEach(mapping => {
        _moveCheck(mapping);
    });
    if(!manifest.name){
        throw new Error('Missing parameter name');
    }
    if(!manifest.version){
        throw new Error('Missing parameter version');
    }else{
        manifest.version = validateSem(manifest.version);
    }
    if(arg.authors){
        manifest.authors = validateAuthors(arg.authors);
    }
    if(arg.keywords){
        manifest.keywords = validateKeywords(arg.keywords);
    }
    if(arg.private){
        manifest.private = true;
    }
    if(arg.dependencies){
        manifest.dependencies = [];
        arg.dependencies.forEach(o => {
            if(!o.name){
                throw new Error('Missing parameter name in dependency');
            }
            if(!o.version){
                throw new Error('Missing parameter name in dependency');
            }
            manifest.dependencies.push({
                name: o.name,
                version: o.version
            });
        });
    }
    if(registry){
        if(!registry.address){
            throw new Error('Missing registry address');
        }else{
            registry.address = normalizeUrl(registry.address);
            if(!validateUrl(registry.address, ['https'])){
                throw new Error('Invalid registry address');
            }
        }
        manifest.registry = registry;
    }
    return manifest;
}