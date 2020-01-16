module.exports = function(io,rooms,mongoose){
    var chatrooms = io.of('/roomlist').on('connection',function(socket){
        var FriendModel = require('../models/FriendModel')   
        console.log("Connection Done!")
        socket.on('getrooms',function(data){
        console.log(data.id)
        findcollections('UserFriend',{ProfileID : data.id},function(err,rooms){
            console.dir(rooms);
        });
        socket.emit('printrooms',JSON.stringify(rooms))
        })
        socket.on('newRoom',function(data){
            rooms.push(data)
            var newfriend = new FriendModel({ProfileID: data.ProfileID,FriendID:data.FriendID,Seenstatus: data.Seenstatus,LastMessagetime: data.LastMessagetime})
            newfriend.save(function (err, FriendModel) {
                if (err) return console.error(err);
                console.log(FriendModel.ProfileID + " saved to Database collection.");
            });
            socket.broadcast.emit('roomupdate',JSON.stringify(rooms))
            socket.emit('roomupdate',JSON.stringify(rooms))
            console.log("Hello")
        })
        function findcollections (name, query, cb) {
            mongoose.connection.db.collection(name, function (err, collection) {
               collection.find(query).toArray(cb);
           });
        }
    })
    var messages = io.of('/messages').on('connection',function(socket){
        console.log("Connection Done!!")
        var ChatModel = require('../models/ChatModel')
        socket.on('joinroom',function(data){
            socket.username = data.username
            socket.userPic = data.userPic
            socket.join(data.room)
            updateUserList(data.room,true)
            var messageslist = []
            findcollections('Chat',{ProfileID1 : data.ProfileID,ProfileID2 : data.room_number},function(err,messageslist){
                console.dir(messageslist)
            })
            socket.emit('printmessages',JSON.stringify(messageslist))
        })

        socket.on('newmessage',function(data){
            var data1 = {
                ProfileID1 : data.ProfileID1,
                ProfileID2 : data.ProfileID2,
                Message : data.message,
                MessageTime : data.messagetime
            }
            var newmessage = new ChatModel({ProfileID1 : data.ProfileID1, ProfileID2 : data.ProfileID2, Message: data.message, MessageTime: data.messagetime})
            newmessage.save(function (err, ChatModel) {
                if(err) return console.error(err);
                console.log(ChatModel.Message + "saved to Database collection.")
            })
            socket.broadcast.to(data.ProfileID2).emit('messagefeed',JSON.stringify(data))
        })

        function updateUserList(room,updateALL){
            var getusers = io.of('/messages').clients(room);
            var userlist = []
            for(var i in getusers)
            {
                userlist.push({user:getusers[i].username})
            }
            //console.log(userlist.length)
            socket.to(room).emit('updateUsersList',JSON.stringify(userlist))
            if(updateALL) {
                socket.broadcast.to(room).emit('updateUsersList',JSON.stringify(userlist))
            }
        }

        socket.on('updateList',function(data){
            updateUserList(data.room,false)
        })

        function findcollections (name, query, cb) {
            mongoose.connection.db.collection(name, function (err, collection) {
               collection.find(query).toArray(cb);
           });
        }
    })
}