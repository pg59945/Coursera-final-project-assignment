const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const router = require('express').Router();

const {
    options
} = require('./swagger.config');

const swaggerSpec = swaggerJSDoc(options);

router.get('/swagger', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

const showExplorer = false;
const opt = {};
const customCss = '.topbar{display:none}';

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, showExplorer, opt, customCss));

module.exports = router;