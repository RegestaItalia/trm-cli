const { tadirInterface } = require('../../functions');

module.exports = async(rfcClient, aTadir) => {
    for(const tadir of aTadir){
        await tadirInterface(rfcClient, {
            pgmid: tadir.PGMID,
            object: tadir.OBJECT,
            objName: tadir.OBJ_NAME,
            devclass: tadir.DEVCLASS,
            srcSystem: tadir.SRCSYSTEM,
            author: tadir.AUTHOR,
            setGenFlag: tadir.GENFLAG
        });
    }
}