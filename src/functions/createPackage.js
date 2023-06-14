module.exports = async(rfcClient, args) => {
    var fmArgs = {
        IS_DATA: {
            DEVCLASS: args.devclass,
            DLVUNIT: args.dlvunit
        }
    };
    if(args.parentcl){
        fmArgs.IS_DATA.PARENTCL = args.parentcl;
    }
    if(args.pdevclass){
        fmArgs.IS_DATA.PDEVCLASS = args.pdevclass;
    }
    if(args.ctext){
        fmArgs.IS_DATA.CTEXT = args.ctext;
    }
    if(args.as4user){
        fmArgs.IS_DATA.AS4USER = args.as4user;
    }
    if(args.trkorr){
        fmArgs.IV_TRKORR = args.trkorr;
    }
    const rfcResult = await rfcClient.call("ZTRM_CREATE_PACKAGE", fmArgs);
}