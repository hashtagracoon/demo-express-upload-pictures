const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  data: Buffer,
  name: String
});

const Item = mongoose.model('items', itemSchema);

exports.itemSchema = itemSchema;
exports.Item = Item;
