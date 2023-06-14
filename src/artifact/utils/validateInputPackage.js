const { getPackageNamespace } = require("../../utils/commons");

module.exports = async (adtClient, package, ns) => {
    var valid = -1;
    var inquirerReturn = false;
    if (package.length > 30) {
        valid = 1;
        inquirerReturn = 'Package name length must not exceed 30 characters limit.';
    } else {
        const packageNamespace = getPackageNamespace(package);
        if (ns) {
            if (packageNamespace !== ns) {
                valid = 2;
                inquirerReturn = `Package must use namespace ${ns}`;
            }
        } else {
            if (!packageNamespace) {
                valid = 3;
                inquirerReturn = `Package name not allowed. Must begin with a customer namespace.`;
            }
        }
        if (valid === -1) {
            searchDevc = await adtClient.searchObject(package, 'DEVC');
            if (searchDevc.length == 1) {
                valid = 4;
                inquirerReturn = `A package named ${package} already exists.`;
            } else {
                valid = 0;
                inquirerReturn = true;
            }
        }
    }

    return {
        valid,
        inquirerReturn
    }
}