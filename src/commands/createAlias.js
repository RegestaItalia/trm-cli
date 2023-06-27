const pickSystem = require('./pickSystem')
const { createAlias } = require('./systems');

module.exports = async(args) => {
    var client = {};
    const connection = args.connection;
    if(connection){
        client = connection.client;
    }
    if(!client.dest || !client.user || !client.passwd || !client.client || !client.lang || !client.ashost || !client.sysnr){
        const connection = await pickSystem({
            skipCreateAlias: true,
            avoidAlias: true
        });
        client = connection.client;
    }
    await createAlias(client);
}