const mongoose = require('mongoose')
const Chat = mongoose.Schema({
    ProfileID1 : String,
    ProfileID2 : String,
    Message : String,
    MessageTime : Date
})
var ChatModel = mongoose.model('Chat',Chat) 
module.exports = ChatModel