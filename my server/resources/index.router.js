Promise = require("bluebird");
const express = require('express');
const swaggerRoutes = require('./swagger-docs/swagger.router');
const userRoutes = require('./users/users.router');
const authRoutes = require('./auth/auth.router');
const dishRouter = require('./dish/dish.router');
const promoRouter = require('./promo/promo.router');
const leaderRouter = require('./leader/leader.router');
const favoriteRouter = require('./favorites/favorites.router');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

// mount user routes at /users
router.use('/users', userRoutes);

// mount swagger routes at /swagger
router.use('/swagger', swaggerRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount dishes routes at /dishes
router.use('/dishes', dishRouter);

// mount promotions routes at /promotions
router.use("/promotions", promoRouter);

// mount leaders routes at /leaders
router.use("/leaders", leaderRouter);

// mount favorites routes at /favorites
router.use("/favorites", favoriteRouter);


module.exports = router;
