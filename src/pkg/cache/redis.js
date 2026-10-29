import Redis from 'ioredis';

export class RedisCacheProvider {
    client;

    constructor(config) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadRetryTime: 3,
        });
        this.client
            .on('error', (err) => {
                console.error('Redis server error:', err.message);
            })
            .connect()
            .catch((err) => {
                console.error('Redis connection error:', err.message);
            })
    }

    set(key, value, ttl) {
        return this.client.set(key, value, 'EX', ttl);
    }
    get(key) {
        return this.client.get(key);
    }
    del(key) {
        return this.client.del(key);
    }

}