const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: false,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        get: getPrice,
        set: setPrice
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

function getPrice(num) {
    return (num / 100).toFixed(2);
}

function setPrice(num) {
    return num * 100;
}

// the schema is useless so far
// we need to create a model using it
const Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;