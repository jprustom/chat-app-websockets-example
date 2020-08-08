import socketio from 'socket.io'
import { server } from '../server'
import Filter from 'bad-words'
import {generateMessage, generateLocationMessage} from '../../shared/messages'

const io:socketio.Server=socketio(server)

io.on('connection',(socket)=>{
    console.log('new websocket connection')
    
    socket.emit('welcomeMessage','Welcome to JPRS Chat Room!')
    socket.broadcast.emit('notification','a new user joined')
    
    socket.on('sendMessage',(messageSent:string,callback:Function)=>{
        const filter:Filter=new Filter()
        if (filter.isProfane(messageSent))
            return callback('Profanity is not allowed')
        
        io.emit('message',generateMessage(messageSent))
        callback() 
    })
    socket.on('sendLocation',({latitude,longitude}:{latitude:string,longitude:string},callback:Function)=>{
       io.emit('locationUrl',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
       callback()
    })
    socket.on('disconnect',()=>{
        io.emit('notification','a user has left')
    })
})