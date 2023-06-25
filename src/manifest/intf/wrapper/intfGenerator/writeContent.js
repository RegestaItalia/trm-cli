const _buildSourceCode = (aSourceCode, object, keyPrefix) => {
    Object.keys(object).forEach(key => {
        const prefix = keyPrefix ? keyPrefix + '_' : '';
        const variableName = `${prefix}${key}`.toLowerCase();
        const value = object[key];
        if(typeof(value) === 'string' || typeof(value) === 'number'){
            aSourceCode.push(`  CONSTANTS ${variableName} TYPE string VALUE '${value}'.`);
        }else if(Array.isArray(value)){
            aSourceCode.push(`  CONSTANTS ${variableName} TYPE string VALUE '${value.join(', ')}'.`);
        }else if(typeof(value) === 'object'){
            aSourceCode = _buildSourceCode(aSourceCode, value, variableName);
        }
    });
    return aSourceCode;
}
module.exports = (intfName, content) => {
    var aSourceCode = [
        `INTERFACE ${intfName.toLowerCase()}`,
        `  PUBLIC .`,
        `  CONSTANTS is_trm_manifest TYPE flag VALUE 'X'.`,
        `  CONSTANTS private TYPE flag VALUE '${content.private ? 'X' : ' '}'.`
    ];
    delete content.private;
    aSourceCode = _buildSourceCode(aSourceCode, content);
    aSourceCode.push(`ENDINTERFACE.`);

    return aSourceCode.join('\r\n');
}