module.exports = async(adtClient, packageMap, objects, updating) => {
    var existingObjects = [];
    var skipObjExistPackage = [];
    Object.keys(packageMap).forEach(key => {
        skipObjExistPackage.push(packageMap[key]);
    });
    for (const obj of objects) {
        var objAlreadyExists = false;
        const searchObj = await adtClient.searchObject(obj.OBJ_NAME, obj.OBJECT);
        if (searchObj.length == 1) {
            if (!updating) {
                objAlreadyExists = true;
            } else {
                const objPackage = searchObj[0]['adtcore:packageName'];
                if (!skipObjExistPackage.includes(objPackage)) {
                    objAlreadyExists = true;
                }
            }
        }
        if (objAlreadyExists) {
            existingObjects.push(obj);
        }
    }
    return existingObjects;
}