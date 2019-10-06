$(function(){
    var socket = io();
    var userName  = document.querySelector('.name');
    var userNickName = document.querySelector('.nickname');
    var userForm =  document.querySelector('.auth__form');
    var $users = $('.members-list');
    var avatarWrap = document.querySelector('.sidebar__avatar');
    var avatarImage = document.querySelector('.sidebar__avatar-img');
    var avatarInput = document.querySelector('.loadImg');
    var modalImageUpload = document.querySelector('.modal');
    var modalClose = document.querySelector('.modal__reset');
    var modalAvatar = document.querySelector('.modal__upload-avatar');
    var uploadImageButtonToServer = document.querySelector('.modal__upload');
    var imageSrc = '';
    var currentNickname;
    const fileReader = new FileReader();
    socket.on('connect',(e)=>{
        socket.emit('get all users');
        $('.chatArea').hide(); 
    })

    avatarWrap.addEventListener('click',(e)=>{
        modalImageUpload.classList.remove('modal-hide');

    })

    modalClose.addEventListener('click',(e)=>{
        modalImageUpload.classList.add('modal-hide');
        modalAvatar.src = '';
    })

    uploadImageButtonToServer.addEventListener("click",function(){
          avatarImage.src = fileReader.result;
          modalImageUpload.classList.add('modal-hide');
        //   var currentUser = document.querySelector('.sidebar__text').innerHTML;
          socket.emit("uploadImageToServer",fileReader.result,currentNickname);
    })

    fileReader.addEventListener('load',function(){
        // avatarImage.src = fileReader.result;
        modalAvatar.src = fileReader.result;
        imageSrc = fileReader.result;
        // console.log(fileReader.result);
       
        // console.log(currentUser);
        // socket.emit("uploadImageToServer",fileReader.result,currentUser);
        // modalImageUpload.classList.add('modal-hide');
    })

    avatarInput.addEventListener('change',function(e){
        let [file] = e.target.files;
        if( file ) {
            if (file.size > 512*1024) {
                alert('BIG');
            } else {
                fileReader.readAsDataURL(file);
            }
        }

    })

    //авторизация пользователя
    $('.auth__form').submit(function(e){
        e.preventDefault();
        let user = {
            name:userName.value,
            nickname : userNickName.value,
            history: '',
            src:''
        }
        currentNickname =  userNickName.value;
        console.log(currentNickname);
        socket.emit('new user', userName.value,user,function(data){
            if(data){
                currentNickname = user.nickname;
                $('.auth').hide();
                $('.chatArea').show(); 

                $('.sidebar__text').html(`${userName.value}`);
                // console.log(user.history);
                socket.on("addHistory",function(history){
                    console.log(history);
                    var tst = document.querySelector('.chatArea__message-list')
                    if(!tst.children.length){
                        for(var i=0;i<history.length;i++) {
                            let msg = history[i];
                            var html = `<li class="chatArea__message-item">
                            <div>
                                <strong>${msg.user} </strong>${msg.time}
                            </div>
                            <div>
                                ${msg.data}
                            </div>
                            </li>` 
                            $('.chatArea__message-list').append(html);
                        }
                    }

                })

                socket.on("addAvatar",function(src,userNickame){
                    // console.log(src);
                    console.log("nickname"+userNickame);
                    console.log("nickname"+currentNickname);

                    // var currentUser = document.querySelector('.sidebar__text').innerHTML;
                    if(currentNickname == userNickame){
                        avatarImage.src = src;
                    }
                })
                
            } else {
                socket.on("showErrorAuthorization",function(errorText){
                    userNickName.style.border = "2px solid red";
                    // var error = document.createElement('div');
                    // error.classList.add('error');
                    // error.innerHTML = errorText;
                    userNickName.placeholder = errorText;
                    userNickName.value='';
                    // error.insertAfter(userNickName);
                    // alert(errorText);
                })
            }
            // $('.sidebar__text').html(`${userName.value}`);
            // // console.log(user.history);
            // socket.on("addHistory",function(history){
            //     console.log(history);
            //     var tst = document.querySelector('.chatArea__message-list')
            //     if(!tst.children.length){
            //         for(var i=0;i<history.length;i++) {
            //             let msg = history[i];
            //             var html = `<li class="chatArea__message-item">
            //             <div>
            //                 <strong>${msg.user} </strong>${msg.time}
            //             </div>
            //             <div>
            //                 ${msg.data}
            //             </div>
            //             </li>` 
            //             $('.chatArea__message-list').append(html);
            //         }
            //     }
            // })

            
           
        });
    })

    //вставка сообщения пользователя 
    $('.chatArea__form').submit(function(e){
        e.preventDefault(); 
        let time  = `${new Date().getHours()}:${new Date().getMinutes()}`;
        let inputedMsg = document.querySelector('.chatArea__inputMsg');
        socket.emit('chat message', inputedMsg.value,time);
        inputedMsg.value = '';
    });
    socket.on('new message', function(msg,){
        var html = `<li class="chatArea__message-item">
        <div>
            <strong>${msg.user} </strong>${msg.time}
        </div>
        <div>
            ${msg.data}
        </div>
        </li>`
        $('.chatArea__message-list').append(html);
        // let msgData = {
        //     user:msg.user,
        //     time:msg.time,
        //     content: msg.data
        // }
        // let msgArea =  $('.chatArea__message-list').html();
        // console.log(msgArea);
        // socket.emit("takeHistory",msgArea,msg.user);
      
        // let msgArea =  $('.chatArea__message-list').html();
        // console.log(msgArea);
    });
    // socket.emit("takeAllHistory",msgData);

    //получение всех пользователей
    socket.on('getUsers',function(usersData,userDB){
        console.log(usersData);
        var html = '';
        for( var i=0; i<usersData.length; i++){
            
            // console.log(userDB[i].name);
            html+=`<li>${usersData[i].name}</li>`;
        }
        // console.log(html);
        $users.html(html);
        
    })

    socket.on('showWhoLeave',function(whoLeaved){
        console.log(`${whoLeaved} leaved`);
    })
})

////////НАОППИНАНИЕ СЕБЕ НА ЗАВТРА. НУЖНО ДОАБВЛЯТЬ ПОЛЕ С 
//СООБЩЕНИЯМИ ПРИ КАЖДОМ ВВОДЕ НОВОГО СООБЩЕНИЯ А НЕ ПРИ ВЫХОДЕ