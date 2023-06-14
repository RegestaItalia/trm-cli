const normalize = require('object-keys-normalizer');

module.exports = (arg) => {
    if (Array.isArray(arg)) {
        return normalize.normalizeKeys(arg, 'camel');
    } else {
        return normalize.normalizeKeys({...arg}, 'camel');
    }
}