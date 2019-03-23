const User = require('./users.model');
const {
    omit
} = require('lodash');

const httpStatus = require('http-status');

const {
    handler: errorHandler
} = require('../../middlewares/errors');

module.exports.list = async (req, res, next) => {
    try {
        const users = await User.find();
        const transformedUsers = users.map(user => user.transform());
        res.json(transformedUsers);
    } catch (error) {
        next(error);
    }
};

module.exports.get = async (req, res, next) => {
    res.json(req.locals.user);
};

module.exports.load = async (req, res, next) => {
    try {
        const user = await User.get(req.params.id);
        req.locals = {
            user
        };
        return next();
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports.create = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports.patch = async (req, res, next) => {
    try {
        const {
            user
        } = req.locals;
        const newUser = new User(req.body);
        const ommitRole = user.role !== 'admin' ? 'role' : '';
        const newUserObject = omit(newUser.toObject(), '_id', 'password', ommitRole);

        await user.update(newUserObject, {
            override: true,
            upsert: true
        });

        const savedUser = await User.findById(user._id);

        res.json(savedUser.transform());
    } catch (error) {
        next(error);
    }
};

module.exports.update = async (req, res, next) => {
    try {

        const user = Object.assign(req.locals.user, req.body);

        user.save()
            .then(savedUser => res.json(savedUser.transform()))
            .catch(error => next(error));

    } catch (error) {
        next(error);
    }
};


module.exports.remove = async (req, res, next) => {
    try {

        const {
            user
        } = req.locals;

        user.remove()
            .then(() => res.status(httpStatus.NO_CONTENT).end())
            .catch(e => next(e));

    } catch (error) {
        next(error);
    }
};