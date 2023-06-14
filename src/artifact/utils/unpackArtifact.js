const AdmZip = require("adm-zip");
module.exports = (zip) => {
    var transports = [];
    const allowedTypes = ['DEVC', 'TADIR'];
    zip.getEntries().forEach(entry => {
        if (allowedTypes.includes(entry.comment)) {
            const artifact = new AdmZip(entry.getData());
            const entries = artifact.getEntries();
            const dataFile = entries.find(o => o.comment === 'data');
            const headerFile = entries.find(o => o.comment === 'header');
            if (dataFile && headerFile) {
                transports.push({
                    type: entry.comment,
                    dataFile: dataFile.getData(),
                    headerFile: headerFile.getData()
                });
            }
        }
    });
    return transports;
}