
const config = require('./config')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { userJoin, getCurrentUser} = require('./function')



app.get('/', function (req, res) {
    res.sendFile('/Users/Kaizoku/documents/sockets/index.html')
})

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/style.css')
})

app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/client.js')
})


let users = {}
let count = 0

io.on('connection', (socket) => {

        let me = false;
        console.log("user connected")
        count++
        for (let i in users) {
        socket.emit('newusr', users[i])
    }

    socket.on('login', (user) => {
        
        const username = 'me'
        const avatar = 'https://api.adorable.io/avatars/70/'+socket.id+'.png'
        const client = userJoin(socket.id, username, avatar)
        me = socket.id
        users[me] = me
        socket.broadcast.emit('newusr', me)
        io.emit('nbrUsers', count)
        const myProfil = getCurrentUser(socket.id)
        io.to(myProfil.id).emit('me', {id : myProfil.id , name : "Me" , avatar : 'https://api.adorable.io/avatars/70/'+myProfil.id+'.png'})
        
    })

    socket.on('disconnect', () => {
        
        delete users[me]
        count--
        io.emit('nbrUsers', count)
        socket.broadcast.emit('delusr', me)
        console.log("diconnect")

    })

    socket.on('typingOn', (value)=>{

        socket.broadcast.emit('typing' , value)

    })

    socket.on('chat message', (msg) => {
                
        var d = new Date();
        var t = d.getHours();
        t= t +':'+ d.getMinutes();
        const myProfil = getCurrentUser(socket.id)
        socket.broadcast.emit('messageReceived' , { msg : msg , time : t , name : myProfil.id})
        io.to(myProfil.id).emit('messageSent' , { msg : msg , time : t , name : myProfil.id})
    
    })

    socket.on('typingOff', (value)=>{
        
        socket.broadcast.emit('typing' , value)
    
    })

    socket.on('image', (data) => {

        var d = new Date();
        var t = d.getHours();
        t= t +':'+ d.getMinutes();
        const myProfil = getCurrentUser(socket.id)
        socket.broadcast.emit('uploadToOthers' , { file : data , time : t , name : myProfil.id})
        io.to(myProfil.id).emit('uploadToCurrentUser' , { file : data , time : t , name : myProfil.id})
        
    })
});



http.listen(config.server.port, config.server.host, function () {
    console.log('Server listen on http://' + config.server.host + ':' + config.server.port);
})