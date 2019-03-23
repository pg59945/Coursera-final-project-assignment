const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'Leader'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
const Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;