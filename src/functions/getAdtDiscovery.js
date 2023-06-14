const { normalize } = require('../utils/commons');

module.exports = async (rfcClient) => {
    const rfcResult = await rfcClient.call("SADT_REST_RFC_ENDPOINT", {
        REQUEST: {
            REQUEST_LINE: {
                METHOD: 'GET',
                URI: '/sap/bc/adt/discovery',
                VERSION: 'HTTP/1.1'
            },
            HEADER_FIELDS: [{
                NAME: 'Accept',
                VALUE: 'application/atomsvc+xml'
            }]
        }
    });
    return normalize(rfcResult.RESPONSE).messageBody.toString();
}