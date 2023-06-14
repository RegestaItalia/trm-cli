module.exports = async(rfcClient, args) => {
    var fmArgs = {
        IV_PGMID: args.pgmid.toUpperCase(),
        IV_OBJECT: args.object.toUpperCase(),
        IV_OBJ_NAME: args.objName.toUpperCase()
    };
    if(args.devclass){
        fmArgs.IV_DEVCLASS = args.devclass.toUpperCase();
    }
    if(args.srcSystem){
        fmArgs.IV_SRCSYSTEM = args.srcSystem.toUpperCase();
    }
    if(args.author){
        fmArgs.IV_AUTHOR = args.author.toUpperCase();
    }
    if(args.setGenFlag){
        fmArgs.IV_SET_GENFLAG = 'X';
    }
    await rfcClient.call("ZTRM_TADIR_INTERFACE", fmArgs);
}