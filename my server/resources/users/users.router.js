const express = require('express');
const router = express.Router();

const {
  authorize,
  ADMIN,
  LOGGED_USER
} = require('../../middlewares/auth');
const userController = require('./users.controller');

router.route('/')
  .get(authorize(ADMIN), userController.list)
  .post(authorize(ADMIN), userController.create);

router.route('/:id')
  .get(authorize(LOGGED_USER), userController.load, userController.get)
  .put(authorize(LOGGED_USER), userController.load, userController.update)
  .patch(authorize(LOGGED_USER), userController.load, userController.patch)
  .delete(authorize(LOGGED_USER), userController.load, userController.remove);

module.exports = router;