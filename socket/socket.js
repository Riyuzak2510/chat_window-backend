module.exports = function(io,rooms){
    var chatrooms = io.of('/roomlist').on('connection',function(socket){
        console.log("Connection Done!")
    })
    socket.on('newRoom',function(data){
        rooms.push(data)
    })
    
}