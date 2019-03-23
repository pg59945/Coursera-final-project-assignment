const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../resources/users/users.model');
const APIError = require('../utils/APIError');
Promise = require('bluebird'); // eslint-disable-line no-global-assign

const ADMIN = 'ADMIN';
const LOGGED_USER = '_loggedUser';
const AUTHENTICATED = 'USER';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    const logIn = Promise.promisify(req.logIn);
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    });

    try {
        if (error || !user) throw error;
        await logIn(user, {
            session: false
        });
    } catch (e) {
        return next(apiError);
    }

    if (roles === LOGGED_USER) {
        if (user.role !== ADMIN && req.params.id !== user._id.toString()) {
            apiError.status = httpStatus.FORBIDDEN;
            apiError.message = 'Forbidden';
            return next(apiError);
        }
    } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = 'Forbidden';
        return next(apiError);
    } else if (err || !user) {
        return next(apiError);
    }

    req.user = user;

    return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;
exports.AUTHENTICATED = AUTHENTICATED;

exports.authorize = (roles = User.roles) => (req, res, next) =>
    passport.authenticate(
        'jwt', {
            session: false
        },
        handleJWT(req, res, next, roles),
    )(req, res, next);

exports.oAuth = service =>
    passport.authenticate(service, {
        session: false
    });