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

    var dropbox;

    dropbox = document.querySelector(".modal__upload-avatar-wrapper");
    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);

    function dragenter(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    function dragover(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    function drop(e) {
        e.stopPropagation();
        e.preventDefault();
        
        var dt = e.dataTransfer;
        var [file] = dt.files;
        console.log(file);
        if(file.size > 512 * 1024 || file.type != 'image/jpeg'){
            alert('Можно загуржать только .jpeg меньше 512кб')
        } else{
            fileReader.readAsDataURL(file);
        }
        // handleFiles(files);
    }




    socket.on('connect',(e)=>{
        socket.emit('get all users');
        $('.chatArea').hide(); 
        // $('.sidebar__members').hide(); 
    })

    avatarWrap.addEventListener('click',(e)=>{
        modalImageUpload.classList.remove('modal-hide');

    })

    modalClose.addEventListener('click',(e)=>{
        modalImageUpload.classList.add('modal-hide');
        modalAvatar.src = '';
    })

    userName.addEventListener('keydown',(e)=>{
        userName.style.border = "2px solid grey";
       
    })
    userNickName.addEventListener('keydown',(e)=>{
        userNickName.style.border = "2px solid grey";
    })

    function validateAuth(){

        if(userName.value == '' || userNickName.value == ''){
            return false
        } else{
            return true;
        }
    }

    uploadImageButtonToServer.addEventListener("click",function(){
        console.log(fileReader.result);
          avatarImage.src = fileReader.result;
          modalImageUpload.classList.add('modal-hide');
        //   var currentUser = document.querySelector('.sidebar__text').innerHTML;
          socket.emit("uploadImageToServer",fileReader.result,currentNickname);
          console.log(currentNickname);
          socket.emit("updateAvatar",fileReader.result,currentNickname);
          
          modalAvatar.src = '';
    })
    socket.on('uploadNewAvatar',function(src,nickname){
        // updateAvatar(src);
        var allCurrentUserMsgs = document.querySelectorAll(`[data-nickname="${nickname}"]`);
        for(var i=0;i<allCurrentUserMsgs.length;i++){
            allCurrentUserMsgs[i].src = src;
        }
    })

    // function updateAvatar(src){
    //     var allCurrentUserMsgs = document.querySelectorAll(`[data-nickname="${currentNickname}"]`);
    //     for(var i=0;i<allCurrentUserMsgs.length;i++){
    //         allCurrentUserMsgs[i].src = src;
    //     }
    // }

    fileReader.addEventListener('load',function(){
        // avatarImage.src = fileReader.result;
        // console.log(fileReader);
        modalAvatar.src = fileReader.result;
        imageSrc = fileReader.result;
        // console.log(fileReader.result);
       
        // console.log(currentUser);
        // socket.emit("uploadImageToServer",fileReader.result,currentUser);
        // modalImageUpload.classList.add('modal-hide');
    })

    // avatarInput.addEventListener('change',function(e){
    //     let [file] = e.target.files;
    //     console.log(file);
    //     if( file ) {
    //         if (file.size > 512*1024) {
    //             alert('BIG');
    //         } else {
    //             fileReader.readAsDataURL(file);
    //         }
    //     }

    // })

    //авторизация пользователя
    $('.auth__form').submit(function(e){
        e.preventDefault();
        if(validateAuth()){
            $('.sidebar__members').show(); 
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
                    socket.on("addHistory",function(history,userDataBase){
                        // console.log(history);
                        // var avatarSrc;
                        // if(currentNickname == nickname){
                        //     avatarSrc = src;
                        // }
                        var tst = document.querySelector('.chatArea__message-list')
                        if(!tst.children.length){
                            let avatarSrc;
                            console.log(history);
                            for(var i=0;i<history.length;i++) {
                                let msg = history[i];
                                for(var j=0;j<userDataBase.length;j++){
                                    var user = userDataBase[j];
                                    if(user.nickname == msg.nickname){
                                        avatarSrc = user.src;
                                    }
                                }
                                console.log(avatarSrc);
                                if(!avatarSrc){
                                    avatarSrc = "./noPhoto.jpg";
                                }
                                console.log(avatarSrc);
                                var html = `
                                    <li class="chatArea__message-item">
                                        <div class="message-item">
                                            <div class="img-wrap">
                                                <img src="${avatarSrc}" alt="" class="avatar-img" data-nickname="${msg.nickname}">
                                            </div>
                                            <div class="message__text">
                                                    <span class="message__text-name">${msg.user}</span>
                                                    <span class="message__text-time">${msg.time}</span>
                                                    <div class="message__text-content">${msg.data}</div>
                                                </div>
                                            </div>
                                    </li>`
                                $('.chatArea__message-list').append(html);
                                document.querySelector('.chatArea__message-list').scrollTop =  document.querySelector('.chatArea__message-list').scrollHeight;
                            }
                        }
    
                    })
    
                    socket.on("addAvatar",function(src,userNickame){
                        // console.log(src);
                        console.log("nickname"+userNickame);
                        console.log("nickname"+currentNickname);
    
                        // var currentUser = document.querySelector('.sidebar__text').innerHTML;
                        if(currentNickname == userNickame){
                            if(src==''){
                                avatarSrc = "./noPhoto.jpg";
                            }else{
                                avatarImage.src = src;
                            }
                           
                            // document.querySelector('.avatar-img').src = src;
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
            });
        } else{
            alert(" Заполните поля!");
            userName.style.border = "2px solid red";
            userNickName.style.border = "2px solid red";
        }
        
    })

    //вставка сообщения пользователя 
    $('.chatArea__form').submit(function(e){
        e.preventDefault(); 
        let time  = `${new Date().getHours()}:${new Date().getMinutes()}`;
        let inputedMsg = document.querySelector('.chatArea__inputMsg');
        socket.emit('chat message', inputedMsg.value,time,currentNickname);
        inputedMsg.value = '';
    });
    socket.on('new message', function(msg,){
        let avatarSrc;
        if(msg.src){
            console.log('some');
            avatarSrc = msg.src;
        } else{
            console.log('empty');
            avatarSrc = './noPhoto.jpg';
        }
        var html = `
        <li class="chatArea__message-item">
            <div class="message-item">
                <div class="img-wrap">
                    <img src="${avatarSrc}" alt="" class="avatar-img" data-nickname="${msg.nickname}">
                </div>
                <div class="message__text">
                        <span class="message__text-name">${msg.user}</span>
                        <span class="message__text-time">${msg.time}</span>
                        <div class="message__text-content">${msg.data}</div>
                    </div>
                </div>
        </li>
        `
        $('.chatArea__message-list').append(html);
        document.querySelector('.chatArea__message-list').scrollTop =  document.querySelector('.chatArea__message-list').scrollHeight;


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
        var tst = document.querySelector('.chatArea__message-list')
        if(whoLeaved && !tst){
            var html = `
        <li class="chatArea__message-item">
            <div class="message-item">Пользователь <b> ${whoLeaved} </b> покинул чат</div>
        </li>
        `
        $('.chatArea__message-list').append(html);
        }
        
    })

    socket.on('onlineUsers',function(count){
        console.log(count);
        document.querySelector('.sidebar__members-count').innerHTML = count;
    })
})

////////НАОППИНАНИЕ СЕБЕ НА ЗАВТРА. НУЖНО ДОАБВЛЯТЬ ПОЛЕ С 
//СООБЩЕНИЯМИ ПРИ КАЖДОМ ВВОДЕ НОВОГО СООБЩЕНИЯ А НЕ ПРИ ВЫХОДЕ