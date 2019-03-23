const express = require('express');
const leaderController = require('./leader.controller');

const leaderRouter = express.Router();

const {
    authorize,
    ADMIN,
    LOGGED_USER,
    AUTHENTICATED
} = require('../../middlewares/auth');

leaderRouter.route('/')
    .get(leaderController.getAll)
    .post(authorize(ADMIN), leaderController.create);

leaderRouter.route('/:id')
    .get(leaderController.load, leaderController.find)
    .put(authorize(ADMIN), leaderController.load, leaderController.update)
    .delete(authorize(ADMIN), leaderController.load, leaderController.remove);

module.exports = leaderRouter;