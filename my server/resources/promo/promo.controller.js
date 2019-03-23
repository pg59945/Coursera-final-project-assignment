const Promotions = require('./promo.model');
const httpStatus = require('http-status');

module.exports.getAll = async (req, res, next) => {
    try {
        const promotions = await Promotions.find();
        res.json(promotions);
    } catch (error) {
        next(error);
    }
};


module.exports.create = async (req, res, next) => {
    try {
        const promotion = await Promotions.create(req.body);
        res.json(promotion);
    } catch (error) {
        next(error);
    }
};

module.exports.load = async (req, res, next) => {
    const promotion = await Promotions.findById(req.params.id);
    if (promotion) {
        req.promotion = promotion;
        next();
    } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({
            message: "Not found"
        });
    }
};

module.exports.find = async (req, res, next) => {
    try {
        res.json(req.promotion);
    } catch (error) {
        next(error);
    }
};

module.exports.update = async (req, res, next) => {
    try {
        const promotion = Object.assign(req.promotion, req.body);
        promotion.save()
            .then(savedPromotion => res.json(savedPromotion.transform()))
            .catch(error => next(error));
    } catch (error) {
        next(error);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const {
            promotion
        } = req;
        promotion.remove().then(() => res.status(httpStatus.NO_CONTENT).end()).catch((error) => next(error));
    } catch (error) {
        next(error);
    }
};