module.exports = async (adtClient) => {
    const result = await adtClient.objectTypes();
    return result.find(o => o.name === 'SKTD') ? true : false;
}