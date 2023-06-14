module.exports = (devclass) => {
    const regex = /^(\$|Z|Y|\/\w*\/)/g;
    const matches = regex.exec(devclass);
    try{
        return matches[1];
    }catch(e){
        return;
    }
}