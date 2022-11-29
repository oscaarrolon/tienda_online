const { model, Schema } = require('mongoose');

const clientSchema = new Schema({
    name: String,
    email: String,
    address: String,
    age: Number,
    active: Boolean,
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

module.exports = model('client', clientSchema)