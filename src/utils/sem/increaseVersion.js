const semver = require('semver');
const validateSem = require('./validateSem');

module.exports = (sem) => {
    const clean = validateSem(sem);
    return semver.inc(clean, 'patch');
}