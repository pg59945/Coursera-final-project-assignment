module.exports = {
    env: process.env.NODE_ENV,
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    jwtExpirationInterval: process.env.JWT_EXPIRATION_INTERVAL || 15,
    jwtSecret: process.env.JWT_SECRET
}