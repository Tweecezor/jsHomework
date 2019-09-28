

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
        var reviewsData = {};

        var myMap = new ymaps.Map("map", {
        center: [55.75399399999374,37.62209300000001],
        zoom: 12,
        controls:[]
        });
        
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
            // if (reviewsData[coords]) {
            //     reviewsData[coords].push(balloonModal);
            //   } else {
            //     reviewsData[coords] = balloonModal;
            //     reviewsData[coords].push(balloonModal);
            //   }
              reviewsData[coords] = balloonModal;
            // console.log(typeof balloonModal);

            return new ymaps.Placemark(coords,
                {
                    balloonContent:JSON.stringify(balloonModal),
                    place:data.place,
                    address:data.address,
                    desc:data.desc,
                    date:data.date,
                    coords:coords
                }, 
                {
                iconLayout: 'default#image',
                iconImageHref: './src/img/Mark.png',
                iconImageSize: [30, 42],
                iconImageOffset: [-13, -38]
                }
            )
            
        }
        var baloonLayout;

        myMap.events.add('click', function (e) {
                clearModalReviewField();
               
                modalReviewContent.innerHTML = emtyReview;
             
                coords = e.get('coords');
                var geoCoords = ymaps.geocode(coords);
                var position = e.get('position');
            
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
     
            e.preventDefault();
 
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
  
                addReviewToModal(review);

   
                clusterer.add(makeMark(coords,review));
                // if (reviewsData[coords]) {
                //     reviewsData[coords].push(review);
                //   } else {
                //     reviewsData[coords] = [];
                //     reviewsData[coords].push(review);
                //   }
                clearInputs();
            }
           
        })
       
        closeModal.addEventListener('click',(e)=>{
            modal.classList.remove('modal-show');
        })

        function addReviewToModal(review){
           var emtyReview = document.querySelector('.modal-comments__comment-empty');
   
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

        e.preventDefault();
    
        var props  = e.get('target').properties;
        // console.log(e.get('target'));
        // console.log(typeof e.get('target').getGeoObjects);
        // console.log(e.get('target').state.get('activeObject'));
        if(typeof e.get('target').getGeoObjects != 'function') {
            var bContent = JSON.parse(props.get('balloonContent'));
            var currentCoords = e.get('coords');
            console.log(currentCoords);
            var position = e.get('position');
            console.log(position);
            var [left,top] = position;
            // console.log ();
    
            // var newContent = 'sdgfdhfgj';
            // props.set('balloonContent',newContent);
    
            // var bContent1 = props.get('balloonContent');
            // console.log(bContent);
            // var [address,reviews] = bContent.split(';');
            // modal.style.cssText = bContent.style
            modal.style.top = `${top}px`;
            modal.style.left = `${left}px`
            document.querySelector('.modal-header__location').innerHTML = bContent.address;
            document.querySelector('.modal-comments__wrapper').innerHTML = bContent.reviews;
            // address = bContent.address;
            // coords = bContent.coords;
            coords = currentCoords;
          
            modal.classList.add('modal-show');
            
        } else {

            var balloonLink = document.querySelector('.balloonLink');
   
            // console.log(e.get('target'));
           
        }

    })

    document.addEventListener('click',(e)=>{
        var target = e.target;
        // console.log(target);
        if( target.className=="balloon_address"){
                // console.log(e.get('target'))
                // console.log(e.get('coords'));
         
        //   console.log(reviewsData)
        //   console.log(coords);
        //   console.log(reviewsData[coords].reviews);
        //   console.log(target.dataset.coords);
          var dataCoords = target.dataset.coords;
        //   console.log(reviewsData[dataCoords].reviews);
          console.log(reviewsData[dataCoords].coords);
          console.log(reviewsData[dataCoords].address);
        //   address = reviewsData[dataCoords].address;

          document.querySelector('.modal-header__location').innerHTML = reviewsData[dataCoords].address;   
          document.querySelector('.modal-comments__wrapper').innerHTML = reviewsData[dataCoords].reviews;   

          coords = reviewsData[dataCoords].coords;
        
        


           modal.classList.add('modal-show');
        //   console.log(target.parentNode);

        // console.log(clusterer.getGeoObjects());
        // var allGeoObjects = clusterer.getGeoObjects();
        // document.querySelector('.modal-comments__wrapper').innerHTML = '';
        // console.log(allGeoObjects[0].get('coords'));
        // console.log(allGeoObjects[0].properties._data);
        



        // debugger;
        // var previousReviewPos = allGeoObjects.length-1;
        // for( var i = 1; i< allGeoObjects.length; i++) {
        //     console.log(allGeoObjects[i].properties._data);
        //     var bContent = JSON.parse(allGeoObjects[i].properties._data.balloonContent);
        //     console.log(bContent);
        //     console.log(bContent.reviews);
        //     document.querySelector('.modal-comments__wrapper').innerHTML += bContent.reviews;
        // }
        // var bContent = JSON.parse(allGeoObjects[previousReviewPos].properties._data.balloonContent);
        // document.querySelector('.modal-comments__wrapper').innerHTML = bContent.reviews;
       
       
       
        } else {
            // console.log('nononono')
        }
    })

    


    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        "<h2 class='balloon_place'>{{properties.place|raw}}</h2>" +
          `<div class='balloon_address' data-coords={{properties.coords|raw}}>{{properties.address|raw}}</div>` +
          "<div class='balloon_desc'>{{properties.desc|raw}}</div>" + 
          "<div class='balloon_date'>{{properties.date|raw}}</div>" 
      );
    
      var clusterer = new ymaps.Clusterer({
        preset: 'twirl#invertedRedClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        clusterBalloonItemContentLayout: customItemContentLayout
      });
    
      myMap.geoObjects.add(clusterer);
    
    });


    // cluster.events.add('objectsaddtomap', function () {

    //     // Получим данные о состоянии объекта внутри кластера.
    //     var geoObjectState = cluster.getObjectState(myGeoObjects[1]);
    //     // Проверяем, находится ли объект находится в видимой области карты.
    //     if (geoObjectState.isShown) {
    
    //         // Если объект попадает в кластер, открываем балун кластера с нужным выбранным объектом.
    //         if (geoObjectState.isClustered) {
    //             geoObjectState.cluster.state.set('activeObject', myGeoObjects[1]);
    //             geoObjectState.cluster.balloon.open();
    
    //         } else {
    //             // Если объект не попал в кластер, открываем его собственный балун.
    //             myGeoObjects[1].balloon.open();
    //         }
    //     }
    
    // });

   
}


export {
  mapInit
}
