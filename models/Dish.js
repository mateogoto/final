const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    price: { type: Number, required: true },
    image: { type: String },
});

module.exports = mongoose.model('Dish', DishSchema);
