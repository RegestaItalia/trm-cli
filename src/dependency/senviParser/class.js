module.exports = (senvi) => {
    var tadirObject;
    var tadirObjName;
    if(senvi.type === 'CLAS'){
        tadirObject = 'CLAS';
        tadirObjName = senvi.object;
    }else if(type === 'OM'){
        if(senvi.object.includes('~')){
            debugger
        }
        tadirObject = 'CLAS';
        tadirObjName = senvi.enclObj;
    }
    if(tadirObject && tadirObjName){
        return {
            object: tadirObject,
            objName: tadirObjName
        };
    }
}