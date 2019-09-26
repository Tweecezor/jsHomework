

function mapInit() {
    ymaps.ready(() => {
        var modal = document.querySelector('.modal');
        var modalWrapper = document.querySelector('.modal-wrapper');
        var modalReviewContent = document.querySelector('.modal-comments__wrapper');
        var emtyReview = document.querySelector('.modal-comments__comment-empty');
        var location = document.querySelector('.modal-header__location');
        var closeModal = document.querySelector('.modal-header__close');
        var addButton = document.querySelector('.modal-comment__btn');
        var address,coords;
        let inputedName = document.querySelector(".modal-comment__name");
        let inputedPlace = document.querySelector(".modal-comment__place");
        let inputedDesc = document.querySelector(".modal-comment__desc");
        var reviewsData = {};

        var myMap = new ymaps.Map("map", {
        center: [55.75399399999374,37.62209300000001],
        zoom: 12
        });

        
        // var placemark = new ymaps.Placemark([55.650625, 37.62708], {
        //     name: 'Считаем'
        // }, {
        //     balloonContentLayout: BalloonContentLayout,
        //     // Запретим замену обычного балуна на балун-панель.
        //     // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
        //     balloonPanelMaxMapArea: 0
        // });

        
        function makeMark(coords,data){
            // console.log(modalWrapper.innerHTML);
            // var balloonModal = [];
            // balloonModal[0] = document.querySelector('.modal-header__location').innerHTML;
            // balloonModal[1] = document.querySelector('.modal-comments__wrapper').innerHTML;
            // var balloonModal = modalWrapper.innerHTML;
            // console.log(modal.style.cssText);
            // modal.style.cssText = 'top:0px;left:0px;'
            var balloonModal = {
                style:modal.style.cssText,
                address:document.querySelector('.modal-header__location').innerHTML,
                reviews:document.querySelector('.modal-comments__wrapper').innerHTML
            }
            // console.log(typeof balloonModal);

            return new ymaps.Placemark(coords, {
               balloonContent:JSON.stringify(balloonModal)
             }, {
                iconLayout: 'default#image',
                iconImageHref: './src/img/Mark.png',
                iconImageSize: [30, 42],
                iconImageOffset: [-13, -38]
             })
            
        }
        

        myMap.events.add('click', function (e) {
                clearModalReviewField();
                coords = e.get('coords');
                var geoCoords = ymaps.geocode(coords);
                var position = e.get('position');
                // console.log(geoCoords);
                console.log(coords)
                var [posX,posY] = position;
                modal.classList.add('modal-show');
                modal.style.top = `${posY}px`;
                modal.style.left = `${posX}px`;

                ymaps.geocode(coords).then((res) =>{
                    address = res.geoObjects.get(0).getAddressLine();
                    location.innerHTML = address;   
                    addButton.addEventListener('click',(e)=>{
                        console.log('last');
                        e.preventDefault();
                        // addButtonActions(coords,address)
                        if (validate()) { 
                            // console.log(coords);
                            let name = inputedName.value;
                            let place = inputedPlace.value;
                            let desc = inputedDesc.value;
                            var date = new Date().toLocaleString('ru');
                            
                            var review = {
                                name:name,
                                place:place,
                                desc:desc,
                                date:date,
                                address:address
                            };
                            console.log(review.date);
                            addReviewToModal(review);

                            myMap.geoObjects.add(makeMark(coords,review));
                            clearInputs();
                        }
                       
                    })
                })
        });

        // function addButtonActions(coords,address,balloonContent,currentPlacemark){
        //     // console.log(balloonContent);
        //     if(balloonContent==undefined) {
        //         if (validate()) { 
        //             // console.log(coords);
        //             let name = inputedName.value;
        //             let place = inputedPlace.value;
        //             let desc = inputedDesc.value;
        //             var date = new Date().toLocaleString('ru');
                    
        //             var review = {
        //                 name:name,
        //                 place:place,
        //                 desc:desc,
        //                 date:date,
        //                 address:address
        //             };
        //             console.log(review.date);
        //             addReviewToModal(review);
    
        //             myMap.geoObjects.add(makeMark(coords,review));
        //             clearInputs();
        //         }
        //     } else {
        //         if (validate()) { 
        //             // console.log(coords);
        //             let name = inputedName.value;
        //             let place = inputedPlace.value;
        //             let desc = inputedDesc.value;
        //             var date = new Date().toLocaleString('ru');
                    
        //             var review = {
        //                 name:name,
        //                 place:place,
        //                 desc:desc,
        //                 date:date,
        //                 address:address
        //             };
        //             // console.log(review.date);
        //             addReviewToModal(review);
        //             var balloonModalNew = modalWrapper.innerHTML;
        //             // console.log('Координаты'+coords);
        //             currentPlacemark.set('balloonContent',balloonModalNew);
        //             // myMap.geoObjects.add(makeMark(coords,review));
        //             clearInputs();
        //         }
        //     }
            
        // }
       
        closeModal.addEventListener('click',(e)=>{
            modal.classList.remove('modal-show');
        })

        function addReviewToModal(review){
           var emtyReview = document.querySelector('.modal-comments__comment-empty');
            // console.log(emtyReview);
            if(emtyReview) {
                modalReviewContent.removeChild(emtyReview);
               addHTML(review);
            } else {
                addHTML(review);
            } 
        }
        function addHTML(review){
            var reviewContentHTML = 
            `<div class="modal-comments__comment-info">
               <div class="modal-comments__comment-info--name">${review.name}</div>
               <span class="modal-comments__comment-info--place">${review.place}</span>
               <span class="modal-comments__comment-info--date">${review.date}</span>
             </div>
             <p class="modal-comments__text">${review.desc}</p>`
            var reviewWrapper =  document.createElement('div');
            reviewWrapper.innerHTML = reviewContentHTML;
            modalReviewContent.append(reviewWrapper);
        }


        function clearModalReviewField(){
            if (!document.querySelector('.modal-comments__comment-empty')) {
                var children = modalReviewContent.children
                while(children.length){
                    modalReviewContent.removeChild(children[0]);
                }
            } else {
                return 0;
            }
            
        }

        function clearInputs(){
            inputedName.value='';
            inputedPlace.value='';
            inputedDesc.value='';
        }

        function validate() {
            let inputedName = document.querySelector(".modal-comment__name");
            let inputedPlace = document.querySelector(".modal-comment__place");
            let inputedDesc = document.querySelector(".modal-comment__desc");

            let name = inputedName.value;
            let place = inputedPlace.value;
            let desc = inputedDesc.value;
          
            if (
              name == "" ||
              place == "" ||
              desc == ""
            ) {
              if (name == "" || inputedName.value<3) {
                inputedName.value = "";
                inputedName.style.borderColor = "red";
                inputedName.placeholder = "Введите свое именя";
              } else {
                inputedName.style.borderColor = "rgb(196,196,196)";
              }
          
              if (place == "" || inputedName.value<3) {
                inputedPlace.value = "";
                inputedPlace.style.borderColor = "red";
                inputedPlace.placeholder = "Введите место";
              } else {
                inputedPlace.style.borderColor = "rgb(196,196,196)";
              }
          
              if (desc == "") {
                inputedDesc.style.borderColor = "red";
                inputedDesc.placeholder = 'Напишите текст отзыва'
              } else {
                inputedDesc.style.borderColor = "rgb(196,196,196)";
              }
          
              return false;
            } else {
              return true;
            }
        }
        myMap.geoObjects.events.add('mouseenter',(e)=>{
            e.get('target').options.set('iconImageHref', '/src/img/ActiveMark.png');
        })
        myMap.geoObjects.events.add('mouseleave',(e)=>{
            e.get('target').options.set('iconImageHref', '/src/img/Mark.png');

           
        })
      myMap.geoObjects.events.add('click',(e)=>{
        //   console.log(e.properties.data.balloonContent)
        e.preventDefault();
        console.log(e.get('target'));
        var props  = e.get('target').properties;

        var bContent = JSON.parse(props.get('balloonContent'));
        // console.log ();

        // var newContent = 'sdgfdhfgj';
        // props.set('balloonContent',newContent);

        // var bContent1 = props.get('balloonContent');
        // console.log(bContent1);
        // var [address,reviews] = bContent.split(';');
        modal.style.cssText = bContent.style
        document.querySelector('.modal-header__location').innerHTML = bContent.address;
        document.querySelector('.modal-comments__wrapper').innerHTML = bContent.reviews;


        modal.classList.add('modal-show');

        addButtonActions('','',)

        // addButtonNew.addEventListener('click',(e)=>{
        //     debugger;
        //     console.log('newnew')
        //     console.log(coords);
        //     e.preventDefault();
        //     if (validate()) { 
        //         // console.log(coords);
        //         let name = inputedName.value;
        //         let place = inputedPlace.value;
        //         let desc = inputedDesc.value;
        //         var date = new Date().toLocaleString('ru');
                
        //         var review = {
        //             name:name,
        //             place:place,
        //             desc:desc,
        //             date:date,
        //             address:address
        //         };
        //         // console.log(review.date);
        //         addReviewToModal(review);
        //         var balloonModalNew = modalWrapper.innerHTML;
        //         console.log('Координаты'+coords);
        //         // props.set('balloonContent',balloonModalNew);
        //         // myMap.geoObjects.add(makeMark(coords,review));
        //         clearInputs();
        //     }
           
        // })
        // closeModal.addEventListener('click',(e)=>{
        //     modal.classList.remove('modal-show');
        // })
        // modal.innerHTML = e.properties.data.balloonContent;
  })

    });
   
}


export {
  mapInit
}
