const crypto = require('crypto');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');
const {
    omitBy,
    isNil
} = require('lodash');
const {
    env,
    jwtSecret,
    jwtExpirationInterval
} = require('../../config/env.vars');
const APIError = require('../../utils/APIError');
const {
    getHash
} = require('../../utils/Password');

const roles = ['USER', 'ADMIN'];

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
        type: String,
        enum: roles,
        default: 'USER',
    },

    snapchat: String,
    facebook: String,
    twitter: String,
    google: String,
    github: String,
    instagram: String,
    linkedin: String,
    steam: String,
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, {
    timestamps: true
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    } else {
        user.password = getHash(user.password);
        next();
    }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return getHash(candidatePassword) === this.password;
};

userSchema.methods.transform = function transform() {
    const transformed = {};
    const fields = ['_id', 'email', 'profile', 'tokens'];

    fields.forEach((field) => {
        transformed[field] = this[field];
    });

    return transformed;
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

userSchema.methods.token = function token() {
    const playload = {
        exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
};

userSchema.statics.get = async function get(id) {
    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(id)) {
            user = await this.findById(id).exec();
        }
        if (user) {
            return user;
        }

        throw new APIError({
            message: 'User does not exist',
            status: httpStatus.NOT_FOUND,
        });
    } catch (error) {
        throw error;
    }
}

userSchema.statics.findAndGenerateToken = async function findAndGenerateToken(options) {
    const {
        email,
        password,
        refreshObject
    } = options;
    if (!email) throw new APIError({
        message: 'An email is required to generate a token'
    });
    const user = await this.findOne({
        email
    }).exec();

    const err = {
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
    };

    if (password) {
        if (user && user.comparePassword(password)) {
            return {
                user,
                accessToken: user.token()
            };
        }
        err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
        if (moment(refreshObject.expires).isBefore()) {
            err.message = 'Invalid refresh token.';
        } else {
            return {
                user,
                accessToken: user.token()
            };
        }
    } else {
        err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
};

userSchema.statics.oAuthLogin = async function oAuthLogin({
    service,
    id,
    email,
    name,
    picture,
}) {
    const user = await this.findOne({
        $or: [{
            [`${service}`]: id
        }, {
            email
        }]
    });
    if (user) {
        user[service] = id;
        if (!user.name) user.name = name;
        if (!user.picture) user.picture = picture;
        return user.save();
        
    }
    const password = uuidv4();
    const userObject = {
        email,
        password,
        name,
        picture,
    };
    userObject[service] = id;
    return this.create(
        userObject
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User;