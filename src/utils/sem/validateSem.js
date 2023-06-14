const semver = require('semver');

module.exports = (sem) => {
    const clean = semver.clean(sem);
    if (!semver.valid(clean)) {
        throw new Error(`Version "${clean}" doesn't respect SEM.`);
    }else{
        return clean;
    }
}