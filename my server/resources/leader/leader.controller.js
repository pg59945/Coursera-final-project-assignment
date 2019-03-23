const Leader = require('./leader.model');
const httpStatus = require('http-status');

module.exports.getAll = async (req, res, next) => {
    try {
        const leaders = await Leader.find();
        res.json(leaders);
    } catch (error) {
        next(error);
    }
};


module.exports.create = async (req, res, next) => {
    try {
        const leader = await Leader.create(req.body);
        res.json(leader);
    } catch (error) {
        next(error);
    }
};

module.exports.load = async (req, res, next) => {
    const leader = await Leader.findById(req.params.id);
    if (leader) {
        req.leader = leader;
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
        res.json(req.leader);
    } catch (error) {
        next(error);
    }
};

module.exports.update = async (req, res, next) => {
    try {
        const leader = Object.assign(req.leader, req.body);
        leader.save()
            .then(savedLeader => res.json(savedLeader.transform()))
            .catch(error => next(error));

    } catch (error) {
        next(error);
    }
};

module.exports.remove = async (req, res, next) => {
    try {
        const {
            leader
        } = req;
        leader.remove().then(() => res.status(httpStatus.NO_CONTENT).end()).catch((error) => next(error));
    } catch (error) {
        next(error);
    }
};