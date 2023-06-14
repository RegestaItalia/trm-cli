const { getAliases } = require('../roamingFolder');
const getConnection  = require('./getConnection');

module.exports = async(alias) => {
    const aliases = getAliases();
    const aliasObj = aliases.find(o => o.name === alias );
    if(aliasObj){
        const client = aliasObj.client;
        return await getConnection(client);
    }else{
        throw new Error(`Alias "${alias}" not found.`);
    }
}