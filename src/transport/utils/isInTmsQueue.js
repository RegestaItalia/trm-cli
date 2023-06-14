const { readTmsQueue } = require('../../functions');
const { setTimeout } = require('timers/promises');
const Logger = require('../../logger');

module.exports = async(rfcClient, trkorr, target) => {
    var inQueue = false;
    var inQueueAttempts = 0;
    const logger = Logger.getInstance();

    while (!inQueue && inQueue < 120) {
        logger.loading(`Reading transport queue, attempt ${inQueueAttempts + 1}...`);
        await setTimeout(6000);
        inQueueAttempts++;
        const tmsQueue = await readTmsQueue(rfcClient, {
            target
        });
        inQueue = tmsQueue.find(o => o.trkorr === trkorr) ? true : false;
    }
    if (!inQueue) {
        throw new Error(`Transport request not found in queue, timed out after ${inQueueAttempts + 1} attempts`);
    }else{
        logger.success(`Transport was released.`);
    }

    return {
        inQueue,
        attempts: inQueueAttempts
    };
}