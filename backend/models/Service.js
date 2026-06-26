const mongoose = require('mongoose');

const ChildServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String }
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  coverImage: { type: String },
  children: [ChildServiceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);

