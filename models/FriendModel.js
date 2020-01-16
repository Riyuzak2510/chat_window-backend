const mongoose = require('mongoose')
const UserFriend = mongoose.Schema({
    ProfileID: String,
    FriendID: String,
    Seenstatus: Boolean,
    LastMessagetime: Date
})
var FriendModel = mongoose.model('UserFriend',UserFriend) 
module.exports = FriendModel