
const { installArtifact } = require('../artifact');

module.exports = async (args) => {
    if(args.packageMap){
        try{
            args.packageMap = JSON.parse(args.packageMap);
        }catch(e){
            throw new Error(`Invalid package map JSON.`);
        }
    }
    await installArtifact(args);
}