const User = require('../users/users.model');
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const RefreshToken = require('../refreshToken/refreshToken.model');
const {
    jwtExpirationInterval
} = require('../../config/env.vars');

function generateTokenResponse(user, accessToken) {
    const tokenType = 'Bearer';
    const refreshToken = RefreshToken.generate(user).token;
    const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    };
}

exports.register = async (req, res, next) => {
    try {
        const user = await (new User(req.body)).save();
        const userTransformed = user.transform();
        const token = generateTokenResponse(user, user.token());
        res.status(httpStatus.CREATED);
        return res.json({
            token,
            user: userTransformed
        });
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {
            user,
            accessToken
        } = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({
            token,
            user: userTransformed
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
    try {
        const {
            user
        } = req;
        const accessToken = user.token();
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({
            token,
            user: userTransformed
        });
    } catch (error) {
        return next(error);
    }
};

exports.refresh = async (req, res, next) => {
    try {
        const {
            email,
            refreshToken
        } = req.body;
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        });
        const {
            user,
            accessToken
        } = await User.findAndGenerateToken({
            email,
            refreshObject
        });
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};