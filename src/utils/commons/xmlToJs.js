const xml2js = require('xml2js');

module.exports = (sXml) => {
    return new Promise((res, rej) => {
        xml2js.parseString(sXml, (err, result) => {
            if (err) {
                rej(err);
            } else {
                res(result);
            }
        });
    });
}