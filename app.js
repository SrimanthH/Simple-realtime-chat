const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 4000
const server = app.listen(PORT,()=>console.log(`Chat Server is kinda running at ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname,'public')))

let socketsconnected =new Set()

io.on('connection', onConnection)

function onConnection(socket) {
    console.log(socket.id)
    socketsconnected.add(socket.id)

    io.emit('clients-total',socketsconnected.size)

    socket.on('disconnect', () => {
        console.log('Socket-dissconnected', socket.id)
        socketsconnected.delete(socket.id)
        io.emit('clients-total',socketsconnected.size)
    })

    socket.on('message', (data)=> {
        console.log(data)
        socket.broadcast.emit('chat-message',data)

    })
    socket.on('feedback', (data)=> {
        socket.broadcast.emit('feedback',data)
    })
}