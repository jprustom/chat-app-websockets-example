import socketio from 'socket.io'
import { server } from '../server'
import Filter from 'bad-words'
import {generateMessage, generateLocationMessage} from '../../shared/messages'
import {addUser,removeUser,getUsersInRoom,getUser} from './users'

const io:socketio.Server=socketio(server)

io.on('connection',(socket)=>{
    console.log('new websocket connection')
    
    socket.on('join',(options:{username:string,room:string},callback:Function)=>{
        const{error,user}=addUser({ id:socket.id,...options})
        if (error) return callback(error)
        socket.join(user.room)
        socket.emit('message',generateMessage('jBot',`Welcome to ${user.room} !`))
        socket.broadcast.to(user.room).emit('message',generateMessage('jBot',`${user.username} joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
     }
      
     )

    
    
    socket.on('sendMessage',(messageSent:string,callback:Function)=>{
        const filter:Filter=new Filter()
        if (filter.isProfane(messageSent))
            return callback('Profanity is not allowed')
        
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,messageSent))
        callback() 
    })
    socket.on('sendLocation',({latitude,longitude}:{latitude:string,longitude:string},callback:Function)=>{
       const user=getUser(socket.id)
       io.to(user.room).emit('locationUrl',generateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
       callback()
    })
    socket.on('disconnect',()=>{
        const userRemoved=removeUser(socket.id)
        if (userRemoved==undefined) return
        io.to(userRemoved.room).emit('message',generateMessage('jBot',`${userRemoved.username} has left`))
        io.to(userRemoved.room).emit('roomData',{
            room:userRemoved.room,
            users:getUsersInRoom(userRemoved.room)
        })
    })
})