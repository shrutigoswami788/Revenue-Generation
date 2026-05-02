const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // default 5 mins

class CacheService {
    static async get(key) {
        return myCache.get(key);
    }

    static async set(key, value, ttlSeconds) {
        return myCache.set(key, value, ttlSeconds);
    }

    static async del(key) {
        return myCache.del(key);
    }
}

module.exports = CacheService;
