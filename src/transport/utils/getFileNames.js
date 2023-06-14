module.exports = (trkorr) => {
    const trkorrRegex = /(\S{3})K(.*)/gi;
    const regexIterator = trkorr.matchAll(trkorrRegex);
    var trkorrFileExtension;
    var trkorrNumber;
    try {
        const matches = regexIterator.next().value;
        trkorrFileExtension = matches[1];
        trkorrNumber = matches[2];
    } catch (e) {
        throw new Error(`Couldn't parse transport ${trkorr}`);
    }

    const headerFileName = `K${trkorrNumber}.${trkorrFileExtension}`;
    const dataFileName = `R${trkorrNumber}.${trkorrFileExtension}`;
    return {
        headerFileName,
        dataFileName
    }
}