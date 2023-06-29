const getAll = require("./getAll")

module.exports = async(connection) => {
    const allManifests = await getAll(connection, true);
    var numerators = [0];
    allManifests.forEach(o => {
        const objName = o.adtObject['adtcore:name'];
        const matches = /(\d*)$/g.exec(objName);
        numerators.push(parseInt(matches[1]));
    });
    numerators = numerators.sort();
    const nextNumberator = numerators[numerators.length - 1] + 1;
    return nextNumberator;
}