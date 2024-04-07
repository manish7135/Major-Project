const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  contact: Number,
  experience: [{
    expName1: String,
    expLocation1: String,
    expDuration1: String,
    expPosition1: String,
    expDescription1: String,
  }],
  skill: [{
    skillName1: String,
    skillLevel1: String,
  }],
  projects: [{
    projectName1: String,
    projectDescription1: String,
  }],
});

module.exports = mongoose.model("Post", postSchema);
