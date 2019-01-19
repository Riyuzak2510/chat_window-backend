module.exports = function(io,rooms){
    var chatrooms = io.of('/roomlist').on('connection',function(socket){
        console.log("Connection Done!")
        socket.on('getrooms',function(){
            socket.emit('printrooms',JSON.stringify(rooms))
        })
        socket.on('newRoom',function(data){
            rooms.push(data)
            socket.broadcast.emit('roomupdate',JSON.stringify(rooms))
            socket.emit('roomupdate',JSON.stringify(rooms))
        })
    })
    var messages = io.of('/messages').on('connection',function(socket){
        console.log("Connection Done!!")
        socket.on('joinroom',function(data){
            socket.username = data.username
            socket.userPic = data.userPic
            socket.join(data.room)
            updateUserList(data.room,true)
        })

        socket.on('newmessage',function(data){
            socket.broadcast.to(data.room_number).emit('messagefeed',JSON.stringify(data))
        })

        function updateUserList(room,updateALL)
        {
            var getusers = io.of('/messages').in(room).clients
            var userlist = []
            for(var i in getusers)
            {
                userlist.push({user:getusers[i].username})
                console.log(getusers[i].username)
            }
            socket.to(room).emit('updateUsersList',JSON.stringify(userlist))
            if(updateALL) {
                socket.broadcast.to(room).emit('updateUsersList')
            }
        }

        socket.on('updateList',function(data){
            updateUserList(data.room)
        })
    })
}