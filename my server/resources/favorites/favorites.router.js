const express = require('express');
const httpStatus = require('http-status');

const Favorite = require('./favorites.model');

const router = express.Router();

const {
    authorize,
    ADMIN,
    LOGGED_USER,
    AUTHENTICATED
} = require('../../middlewares/auth');

router.route('/')
    .get(authorize(AUTHENTICATED), async (req, res, next) => {
        try {
            const favorites = await Favorite.find({
                user: req.user.id
            }).populate('user').populate('dishes')
            res.json(favorites);
        } catch (error) {
            next(error);
        }
    })
    .post(authorize(AUTHENTICATED), async (req, res, next) => {
        try {
            const favorites = await Favorite.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: {
                    user: req.user.id,
                    dishes: [...req.body.dishes]
                }
            }, {
                upsert: true,
                returnNewDocument: true
            });
            res.json(favorites);
        } catch (error) {
            next(error);
        }
    }).delete(authorize(AUTHENTICATED), async (req, res, next) => {
        try {
            const deleted = await Favorite.findOneAndDelete({
                user: req.user.id
            });
            if (deleted) {
                res.status(httpStatus.NO_CONTENT).end();
            } else {
                res.status(httpStatus.NOT_FOUND).json({
                    message: 'Not Found'
                });
            }
        } catch (error) {
            next(error);
        }
    });

router.route('/:id')
    .post(authorize(AUTHENTICATED), async (req, res, next) => {
        try {
            const favorites = await Favorite.findOneAndUpdate({
                user: req.user.id,
            }, {
                $addToSet: {
                    dishes: [req.params.id]
                }
            });
            res.json(favorites);
        } catch (error) {
            next(error);
        }
    }).delete(authorize(AUTHENTICATED), async (req, res, next) => {
        try {
            const favorites = await Favorite.findOneAndUpdate({
                user: req.user.id,
            }, {
                $pullAll: {
                    dishes: [req.params.id]
                }
            });
            res.json(favorites);
        } catch (error) {
            next(error);
        }
    });

module.exports = router;