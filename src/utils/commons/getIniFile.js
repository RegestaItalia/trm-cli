const ini = require('ini');
const fs = require('fs');
const normalize = require('./normalize');

module.exports = (path) => {
    const iniFile = ini.parse(fs.readFileSync(path || './sapnwrfc.ini', 'utf-8'));
    return normalize(iniFile);
}