const noderfc = require('node-rfc');
const { ADTClient, session_types } = require('abap-adt-api');
const Logger = require('../logger');
const { getAdtDiscovery } = require('../functions');
const { getAdtEndpoint } = require('../utils/adt');
const https = require('https');

module.exports = async(client) => {
    const logger = Logger.getInstance();
    
    logger.loading(`Connecting to ${client.dest}...`);
    try {
        const rfcClient = new noderfc.Client(client);
        
        await rfcClient.open();
        const adtEndpoints = await getAdtEndpoint(rfcClient);
        const adtEndpoint = adtEndpoints.httpStatefulEndpoint || adtEndpoints.httpEndpoint;
        if(!adtEndpoint){
            throw new Error(`Couldn't find ADT endpoint.`);
        }
        const adtClient = new ADTClient(
            `${adtEndpoint.protocol}://${adtEndpoint.address}:${adtEndpoint.port}`,
            client.user,
            client.passwd,
            client.client,
            client.lang,
            {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            }
        );
        adtClient.stateful = session_types.stateful;
        logger.success(`Connected to ${client.dest} as ${client.user}.`)
        return {
            client,
            rfcClient,
            adtClient
        };
    } catch (e) {
        throw new Error(`Connection to ${client.dest} as ${client.user} failed.`);
    }
}