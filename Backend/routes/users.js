const mongoose= require('mongoose');
const plm=require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1/Major_Project");
const userSchema=mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
  contact:String,
  posts: [{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Post' }]
})
userSchema.plugin(plm);
module.exports=mongoose.model("User",userSchema);