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
}