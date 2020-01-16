const mongoose = require('mongoose')
const ChatUser = new mongoose.Schema({
    ProfileID: String,
    Fullname: String,
    Profilepic: String,
    Email: String,
})

const userModel = mongoose.model('ChatUser',ChatUser)

module.exports = userModel
