module.exports = async(adtClient, types) => {
    var tableData = [];

    const systemObjectTypes = await adtClient.objectTypes();
    types.forEach(objType => {
        if (!systemObjectTypes.find(o => o.name === objType)) {
            tableData.push([objType]);
        }
    });

    return tableData;
}