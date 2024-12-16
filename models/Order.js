const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    tableId: { type: String, required: true }, 
    items: [
        {
            dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    status: { type: String, enum: ['pending', 'delivered', 'cancelled'], default: 'pending' }, 
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Order', OrderSchema);
