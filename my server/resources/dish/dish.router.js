const express = require('express');

const dishController = require('./dish.controller');

const router = express.Router();

const {
    authorize,
    ADMIN,
    AUTHENTICATED
} = require('../../middlewares/auth');

router.route('/')
    .get(dishController.getAll)
    .post(authorize(ADMIN), dishController.create);

router.route('/:id')
    .get(dishController.load, dishController.find)
    .put(authorize(ADMIN), dishController.load, dishController.update)
    .delete(authorize(ADMIN), dishController.load, dishController.remove);

router.route('/:id/comments')
    .post(authorize(AUTHENTICATED), dishController.load, dishController.createComment)
    .delete(authorize(ADMIN), dishController.load, dishController.deleteAllComments);

router.route('/:id/comments/:commentId')
    .put(authorize(AUTHENTICATED), dishController.load, dishController.updateComment)
    .delete(authorize(AUTHENTICATED), dishController.load, dishController.removeComment);

module.exports = router;