const getRoamingFolder = require('./getRoamingFolder');

module.exports = () => {
    const roamingDir = getRoamingFolder();
    const sXml = fs.readFileSync(`${roamingDir}\\SAP\\Common\\SAPUILandscape.xml`, { encoding: 'utf8', flag: 'r' });
    return sXml;
}