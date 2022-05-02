const amqp = require('amqplib');

const Config = {
    AMQP_URI: process.env.AMQP_URI || 'amqps://jdksxkpr:dH7lvZjqGt-6XEahnupT88S3WzRgzyns@chinook.rmq.cloudamqp.com/jdksxkpr',
    queue: 'Q_claims_inbound'
}

class QueuePublisher {
    constructor() {
        this.conn;
        this.uri = Config.AMQP_URI
        this.channel;
        this.q = Config.queue;
        this.setupConnection()
    }

    setupConnection = async () => {
        this.conn = await amqp.connect(this.uri);
        this.channel = await this.conn.createChannel();
        await this.channel.assertQueue(this.q, { durable: true });
    }

    close = async () => {
        try {
            if (this.channel) await this.channel.close();
            await this.conn.close();
        } catch (exception) {
            /** Ignore for Closing Connections */
        }
    }

    send = async (message) => {
        this.channel.sendToQueue(this.q, Buffer.from(JSON.stringify(message)))
        console.log('QueuePublisher:send', message);
    }

    /**
     * @desc process all claims in batches
     * @param {*} orgID 
     * @param {*} batch Claims array
     * @returns null
     */
    dispatchBatch = async (orgID, batch) => {
        await this.promiseAll(
            batch.map(claim => () => { return this.send({ orgID, ...claim }) }),
            100
        );
    }

    /**
     * @desc Custom Function to bring concurrency control to claims
     * @param {*} queue 
     * @param {*} concurrency 
     * @returns Array of Results
     */
    promiseAll = async (queue, concurrency) => {
        let index = 0;
        const results = [];

        /** Run a Pseudo thread */
        const execThread = async () => {
            while (index < queue.length) {
                const curIndex = index++;
                /** Use of `curIndex` as `index` may change after await is resolved */
                results[curIndex] = await queue[curIndex]();
            }
        };
        /** Start Pseudo threads */
        const threads = [];
        for (let thread = 0; thread < concurrency; thread++) {
            threads.push(execThread());
        }
        await Promise.all(threads);
        return results;
    };

}

module.exports = QueuePublisher
