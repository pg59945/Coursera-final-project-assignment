const Dish = require('./dish.model');
const Comment = require('../comment/comment.model');

const httpStatus = require('http-status');

module.exports.getAll = async (req, res, next) => {
    try {
        const dishes = await Dish.find().populate('comments');
        res.json(dishes);
    } catch (error) {
        next(error);
    }
};


module.exports.create = async (req, res, next) => {
    try {
        const dish = await Dish.create(req.body);
        res.json(dish);
    } catch (error) {
        next(error);
    }
};

module.exports.load = async (req, res, next) => {
    const dish = await Dish.findById(req.params.id);
    if (dish) {
        req.dish = dish;
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
        res.json(req.dish);
    } catch (error) {
        next(error);
    }
};

module.exports.update = async (req, res, next) => {
    try {
        const dish = Object.assign(req.dish, req.body);
        dish.save()
            .then(savedDish => res.json(savedDish.transform()))
            .catch(error => next(error));
    } catch (error) {
        next(error);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const {
            dish
        } = req;
        dish.remove().then(() => res.status(httpStatus.NO_CONTENT).end()).catch((error) => next(error));
    } catch (error) {
        next(error);
    }
};


module.exports.deleteAllComments = async (req, res, next) => {
    try {
        const dish = Object.assign(req.dish, {
            comments: []
        });
        dish.save()
            .then(savedDish => res.json(savedDish.transform()))
            .catch(error => next(error));
    } catch (error) {
        next(error);
    }
};

module.exports.updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOneAndUpdate({
            user: req.user.id,
            _id: req.params.commentId
        }, {
            $set: req.body
        }, {
            returnNewDocument: true
        });
        if (comment) {
            res.json(Object.assign(comment, req.body));
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                message: 'Not Found'
            });
        }

    } catch (error) {
        next(error);
    }
};

module.exports.removeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOneAndDelete({
            user: req.user.id,
            _id: req.params.commentId
        });

        if (comment) {
            res.status(httpStatus.NO_CONTENT).end();
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                message: 'Not found'
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.createComment = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            ...req.body,
            user: req.user.id
        });
        const newCommentsArray = [...req.dish.comments, comment.id]
        const dish = Object.assign(req.dish, {
            comments: newCommentsArray
        });
        dish.save()
            .then((savedDish) => res.json(savedDish))
            .catch((e) => next(e));
    } catch (error) {
        next(error);
    }
};