const Logger = require('../../logger');

module.exports = (message) => {
    const logger = Logger.getInstance();
    if (message.text) {
        const splitString = message.text.split('\n');
        if (message.type === 'info') {
            splitString.forEach(s => logger.info(s));
        } else if (message.type === 'warn') {
            splitString.forEach(s => logger.warning(s));
        }
    }
}