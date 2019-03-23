const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unite: true
    },
    dishes: [{
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'Dish'
    }]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
const Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;