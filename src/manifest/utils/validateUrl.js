const { URL, parse } = require('url');

module.exports = (s, protocols) => {
    try {
        new URL(s);
        const parsed = parse(s);
        return protocols
            ? parsed.protocol
                ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
                : false
            : true;
    } catch (err) {
        return false;
    }
};