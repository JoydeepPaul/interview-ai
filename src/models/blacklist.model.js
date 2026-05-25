import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  token:{
    type: String,
    required: [true,"token is required"]
  }
  },{
    timestamps: true
  })
const tokenBlacklistModel = mongoose.model('TokenBlacklist', blacklistSchema);
export default tokenBlacklistModel;
