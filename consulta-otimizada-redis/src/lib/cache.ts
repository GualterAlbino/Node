import IORedis from 'ioredis';

const redis = new IORedis({
	host: process.env.REDIS_HOST || 'localhost',
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

export default redis;
