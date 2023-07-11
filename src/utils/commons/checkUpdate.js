const semver = require('semver');
const latest = require('latest');
const capitalizeFirstLetter = require('./capitalizeFirstLetter');
const { name, version } = require('../../../package.json');

module.exports = async () => {
    const getLatest = new Promise((res, rej) => {
        latest(name, function(err, v) {
            if(err){
                rej(err);
            }
            res(v);
        });
    })

    const latestVersion = await getLatest;
    // check if local package version is less than the remote version
    const updateAvailable = semver.lt(version, latestVersion);

    if (updateAvailable) {
        let updateType = '';

        // check the type of version difference which is usually patch, minor, major etc.
        let verDiff = semver.diff(version, latestVersion);

        if (verDiff) {
            updateType = capitalizeFirstLetter(verDiff);
        }

        return {
            //updateAvailable: `${updateType} update available ${chalk.dim(version)} → ${chalk.green(latestVersion)}`,
            //runUpdate: `Run ${chalk.cyan(`npm i -g ${name}`)} to update`,
            updateAvailable: `${updateType} update available ${version} → ${latestVersion}`,
            runUpdate: `Run npm i -g ${name} to update`,
        };
    }
};