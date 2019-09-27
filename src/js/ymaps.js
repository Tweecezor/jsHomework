

function mapInit() {
    ymaps.ready(() => {
        var modal = document.querySelector('.modal');
        var modalWrapper = document.querySelector('.modal-wrapper');
        var modalReviewContent = document.querySelector('.modal-comments__wrapper');
        var emtyReview = modalReviewContent.innerHTML;
        var location = document.querySelector('.modal-header__location');
        var closeModal = document.querySelector('.modal-header__close');
        var addButton = document.querySelector('.modal-comment__btn');
        var address,coords;
        let inputedName = document.querySelector(".modal-comment__name");
        let inputedPlace = document.querySelector(".modal-comment__place");
        let inputedDesc = document.querySelector(".modal-comment__desc");

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
                reviews:document.querySelector('.modal-comments__wrapper').innerHTML,
                coords:coords
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

        function makeClusterMark(coords,data){

            // console.log([data.place,data.address,data.desc].join('<br/>'));
            // var balloonHTML = `${data.place} <br/> <a href="" class='balloonLink'>${data.address}</a><br/> ${data.desc}`
            // console.log(balloonHTML);
            console.log(BalloonContentLayout);
            return new ymaps.Placemark(coords, {
                place : `${data.place}`,
                address : `${data.address}`,
                desc : `${data.desc}`
             },{
               balloonContent:BalloonContentLayout
             })
        }

        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
                '<b>{{properties.place}}</b><br />' +
                '<i id="count"></i> ' +
                '<button id="counter-button"> +1 </button>' +
            '</div>', {

            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
                document.querySelector('.balloonLink').bind('click', this.onLinkClick);
                // $('#count').html(counter);
            },

            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                document.querySelector('.balloonLink').unbind('click', this.onLinkClick);
                BalloonContentLayout.superclass.clear.call(this);
            },

            onLinkClick: function () {
               console.log('worked');
            }
        });

       

        myMap.events.add('click', function (e) {
                clearModalReviewField();
                // modalReviewContent.innerHTML = document.querySelector('.modal-comments__comment-empty').innerHTML;
                modalReviewContent.innerHTML = emtyReview;
                console.log(emtyReview)
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
                })
        });
        addButton.addEventListener('click',(e)=>{
            console.log(coords);
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
                    address:address,
                    coords:coords
                };
                console.log(review.date);
                addReviewToModal(review);

               
                clusterer.add(makeClusterMark(coords,review));
                myMap.geoObjects.add(makeMark(coords,review));
                clearInputs();
            }
           
        })
       
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
        //   console.log(addButton);
        //   console.log(e.properties.data.balloonContent)
        e.preventDefault();
        // console.log(e.get('coords'));
        // console.log(e.get('target'));
        var props  = e.get('target').properties;
        // console.log(e.get('target'));
        // console.log(typeof e.get('target').getGeoObjects);
        console.log(e.get('target').state.get('activeObject'));
        if(typeof e.get('target').getGeoObjects != 'function') {
            var bContent = JSON.parse(props.get('balloonContent'));
            // console.log ();
    
            // var newContent = 'sdgfdhfgj';
            // props.set('balloonContent',newContent);
    
            // var bContent1 = props.get('balloonContent');
            // console.log(bContent);
            // var [address,reviews] = bContent.split(';');
            modal.style.cssText = bContent.style
            document.querySelector('.modal-header__location').innerHTML = bContent.address;
            document.querySelector('.modal-comments__wrapper').innerHTML = bContent.reviews;
            coords = bContent.coords;
    
            modal.classList.add('modal-show');
        } else {
            // console.log('cluster clicked');
            var balloonLink = document.querySelector('.balloonLink');
            // console.log(balloonLink);
            // balloonLink.addEventListener('click',(e)=>{
            //     e.preventDefault();
            //     console.log('worked');
            // })
           
        }
       

    })


    var clusterer = new ymaps.Clusterer({
        // preset: 'twirl#invertedRedClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        // clusterBalloonItemContentLayout: customItemContentLayout
      });
      
    myMap.geoObjects.add(clusterer);


    
    
    });

   
}


export {
  mapInit
}
