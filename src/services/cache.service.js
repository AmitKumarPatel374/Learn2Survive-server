const redis = require("ioredis")

const cacheInstance = new redis.Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
})

module.exports=cacheInstance;
