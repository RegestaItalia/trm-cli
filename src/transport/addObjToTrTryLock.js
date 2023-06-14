const { addObjectsToTr } = require("../functions");

module.exports = async(rfcClient, trkorr, obj) => {
    try{
        await addObjectsToTr(rfcClient, {
            lock: true,
            trkorr: trkorr,
            objs: [obj]
        });
    }catch(e){
        await addObjectsToTr(rfcClient, {
            lock: false,
            trkorr: trkorr,
            objs: [obj]
        });
    }
}