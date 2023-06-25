const getObjUrl = require('./getObjUrl');

const _getStringConstantValue = (source, constantName) => {
    const regex = new RegExp(`CONSTANTS\\s*${constantName}\\s*TYPE\\s*string\\s*VALUE\\s*'(.*)'\\.$`, 'gmi');
    try{
        const matches = regex.exec(source);
        return matches[1];
    }catch(e){
        //
    }
}

const _getFlagConstantValue = (source, constantName) => {
    const regex = new RegExp(`CONSTANTS\\s*${constantName}\\s*TYPE\\s*flag\\s*VALUE\\s*'(.*)'\\.$`, 'gmi');
    try{
        const matches = regex.exec(source);
        return matches[1] === 'X' ? true : false;
    }catch(e){
        //
    }
}

module.exports = async (objName, adtClient) => {
    const url = getObjUrl(objName);
    const source = await adtClient.getObjectSource(url + '/source/main?version=workingArea');
    const name = _getStringConstantValue(source, 'name');
    const version = _getStringConstantValue(source, 'version');
    const description = _getStringConstantValue(source, 'description');
    const website = _getStringConstantValue(source, 'website');
    const gitRepository = _getStringConstantValue(source, 'git_repository');
    const authors = _getStringConstantValue(source, 'authors');
    const keywords = _getStringConstantValue(source, 'keywords');
    const license = _getStringConstantValue(source, 'license');
    const private = _getFlagConstantValue(source, 'private');

    return {
        name,
        version,
        description,
        website,
        gitRepository,
        authors,
        keywords,
        license,
        private
    };
}