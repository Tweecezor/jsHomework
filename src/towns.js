
/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

var town;
/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

function main() {
    loadTowns()
        .then( (cities) => {
            makeCitiesArray(cities) 
        })
        .catch( () => {
            errorHandler();
        });
}
main();
 
function loadTowns() {
    // return await fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
    // .then((response)=>console.log(response.text()));

    // .then((response)=> {response.json().then((cities)=> {
    //     // console.log(cities);
    //     loadingBlock.style.display = 'none';
    //     filterBlock.style.display = "block";
    //     // debugger;
    //     cities.sort((a,b)=>{
    //         if (a.name>b.name) {
    //             return 1
    //         } else {
    //             return -1
    //         }
    //     })
    //     console.log(cities);
    //     })
    // });
    return new Promise ((resolve, reject)=> {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.send();
        xhr.responseType = 'json';
        xhr.addEventListener('load', ()=> {
            if (xhr.status < 400 ) {
                loadingBlock.style.display = 'none';
                filterBlock.style.display = 'block';
                var response = (xhr.response);

                response.sort ( (a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    } else if (a.name < b.name) {
                        return -1;
                    }
                });
                resolve(response);
            } else {
                reject();
            }
            
        }) 
    })
}

function makeCitiesArray(cities) {
    var arr = [];

    for ( var city in cities) {
        if (cities.hasOwnProperty(city)) {
            arr.push(cities[city].name);
        }
    }
    town = arr;
}

function errorHandler() {
    homeworkContainer.innerHTML = '';
    var errorText = document.createElement('div');

    errorText.innerHTML = 'Произошла ошибка';
    var again = document.createElement('button');

    again.classList.add('again');
    again.innerHTML = 'Повторить'
    var fragment = document.createDocumentFragment();

    fragment.append(errorText);
    fragment.append(again);
    homeworkContainer.append(fragment);
    againRequest();
}

function againRequest() {
  
    const againBtn = homeworkContainer.querySelector('.again');

    againBtn.addEventListener('click', ()=> {
        main();
    })
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    // filterResult.innerHTML = [];
    // console.log(full);
    // for (var i = 0; i < full.length;i++) {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) != -1) {

        return true;
    } else if (full.toLowerCase().indexOf(chunk.toLowerCase()) == -1) {
        
        return false;
    }
    // }
}

filterInput.addEventListener('keyup', function() {
    if (filterInput.value == '') {
        filterResult.innerHTML = [];
    } else {
        filterResult.innerHTML = [];
        for (var i = 0; i < town.length; i++) {
          
            if ( isMatching (town[i], filterInput.value) == true) {
                var li = document.createElement('li');
          
                li.innerHTML = town[i];
                filterResult.append(li);
            }
        }
    }
   
});

export {
    loadTowns,
    isMatching
};
