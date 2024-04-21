const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  firstName: String,
  LastName: String,
  Email: String,
  phone: Number,
  country: String,
  city: String,
  summary: String,
  education: String,
  skills: {
    type:Array,
    default:[],
  }, // Define skills as an array of strings
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model("Post", postSchema);
