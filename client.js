$(function () {

    let socket = io()
    socket.emit('login' , {id : Date.now()})
    

    const inpFile = document.getElementById("inpFile");
    const previewUl = document.getElementById("messages");
    const preview = previewUl.querySelector(".preview");

    inpFile.addEventListener("change", function(){
        
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", function(){
                socket.emit('image' , this.result)
            });
            reader.readAsDataURL(file);
            
        }
    })

    const typingDetect = document.querySelector('input');
    const addText = document.getElementById('values');

    typingDetect.addEventListener('input', updateValue);

    function updateValue(e) {
      
        socket.emit('typingOn', e.target.value)
       
    }



    
    $('form').submit(function (e) {
        
        e.preventDefault();
        let text = $('#input-message').val();
        if (text != "") {

            socket.emit('chat message' , text)
            $('#input-message').val('')
            
        }

        return false;
    });



    socket.on('uploadToCurrentUser' , function (data) {
        
        $('#messages').append('<div class="row d-flex flex-row-reverse mt-3"><div class="col-1" style="font-size:8pt; margin-bottom:10px; margin-top:50px;"><img style="border-radius:20%" src="https://api.adorable.io/avatars/1/'+data.name+'.png" /> '+data.time+'</div><div class="col-lg-2 msg-sent" ><img style="width:100%; height:100%" src="'+data.file+'" /></div></div>')
        $('#inpFile').val('')
    
    })
    
    socket.on('uploadToOthers' , function (data) {
        
        $('#messages').append('<div class="row d-flex mt-3"><div class="col-1" style="font-size:8pt; margin-bottom:10px; margin-top:50px;"><img style="border-radius:20%" src="https://api.adorable.io/avatars/1/'+data.name+'.png" /> '+data.time+'</div><div class="col-lg-2 msg-sent" ><img style="width:100%; height:100%" src="'+data.file+'" /></div></div>')
        $('#inpFile').val('')
    
    })

    socket.on('nbrUsers' , function (user) {
        $('#users').html('<p>Users: ' + user + '</p>')
    })


    
    socket.on('me' , function (user) {

        $('#membre').append('<div id="user-' + user.id + '" class="text-success" style-"margin-bottom:10px">'+ user.name +'<br><img style="border-radius:10%" src='+user.avatar+' /></div>')
    
    })

    socket.on('newusr' , function (user) {
        
        $('#membre').append('<div id="user-' + user + '" class="text-info">User<br><img style="border-radius:10%" src="https://api.adorable.io/avatars/70/'+user+'.png" /></div>')
    
    })


    socket.on('delusr' , function (user) {

        $('#user-' + user).remove();
    })

    socket.on('typing' , function (value) {
        
        if (value != "") {
            $('#values').html('Someone is typing...')
        }
        else{
            $('#values').html('')
        }
        
    })

    socket.on('messageReceived' , function (msg) {
        
        $('#messages').append('<div class="row d-flex mt-3"><div class="col-1" style="font-size:8pt; margin-bottom:10px; margin-top:50px;"><img style="border-radius:20%" src="https://api.adorable.io/avatars/1/'+msg.name+'.png" /> '+msg.time+'</div><div class="col-lg-2 msg-sent" ><p>'+msg.msg+'</p></div></div>')
        $('#values').html('')
    
    })

    socket.on('messageSent' , function (msg) {
       
        $('#messages').append('<div class="row d-flex flex-row-reverse mt-3"><div class="col-1" style="font-size:8pt; margin-bottom:10px; margin-top:50px;"><img style="border-radius:20%" src="https://api.adorable.io/avatars/1/'+msg.name+'.png" /> '+msg.time+'</div><div class="col-lg-2 msg-sent" ><p>'+msg.msg+'</p></div></div>')
        $('#values').html('')
    
    })
    

});