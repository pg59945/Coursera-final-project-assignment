const express = require('express');

const promoControler = require('./promo.controller');

const router = express.Router();

const {
    authorize,
    ADMIN,
} = require('../../middlewares/auth');

router.route('/')
    .get(promoControler.getAll)
    .post(authorize(ADMIN), promoControler.create);

router.route('/:id')
    .get(promoControler.load, promoControler.find)
    .put(authorize(ADMIN), promoControler.load, promoControler.update)
    .delete(authorize(ADMIN), promoControler.load, promoControler.remove);

module.exports = router;