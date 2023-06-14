const R3Trans = require('node-r3trans');
const { getTmpFolderPath } = require('../../roamingFolder');

module.exports = async(transports) => {
    const tmpFolderPath = getTmpFolderPath();
    var packages = [];
    var tdevc = [];
    var tdevct = [];
    var objects = [];

    for (var transport of transports) {
        const trR3trans = new R3Trans(transport.dataFile, {
            tmpFolderPath
        });
        try {
            const trE070 = await trR3trans.getTableEntries('E070')
            transport.trkorr = trE070[0].TRKORR;
        } catch (e) {
            throw new Error('E070 record not found in artifact.');
        }
        const trTdevc = await trR3trans.getTableEntries('TDEVC');
        const trTdevct = await trR3trans.getTableEntries('TDEVCT');
        const trTadir = await trR3trans.getTableEntries('TADIR');
        trTadir.forEach(tadirEntry => {
            if (tadirEntry.OBJECT !== 'DEVC') {
                objects.push(tadirEntry);
            } else {
                packages.push(tadirEntry.OBJ_NAME);
            }
        });
        tdevc = tdevc.concat(trTdevc);
        tdevct = tdevct.concat(trTdevct);
    }

    return {
        packages,
        tdevc,
        tdevct,
        objects
    };
}