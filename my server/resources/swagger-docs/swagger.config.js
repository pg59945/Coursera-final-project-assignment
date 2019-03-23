module.exports = {
    options: {
        swaggerDefinition: {
            info: {
                title: 'API server',
                version: '0.0.1',
                description: '',
            },
            host: process.env.HOST || `localhost:${process.env.PORT}`,
            basePath: '/api',
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    description: 'JWT authorization of an API',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
        apis: [__dirname + '/../server/**/*.js'],
    }
};