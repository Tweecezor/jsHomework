/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {

    return new Promise ( (resolve) => {
        setTimeout( () => resolve(), seconds*1000);
    })
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    
    return new Promise ((resolve)=> {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.send();
        xhr.responseType = 'json';
        xhr.addEventListener('load', ()=> {
            var response = (xhr.response);

            response.sort ( (a, b) => {
                if (a.name > b.name) {

                    return 1;
                } else if (a.name <= b.name) {

                    return -1;
                }
            // debugger;
            // (a.name > b.name) ? return1 : return-1;
            });
            resolve(response);
            // console.log(response);
            // console.log(response);
            // console.log(response);
            // var cities = []
            // var rez = [];
            // for (var city in response) {
            //     cities.push(response[city].name);
            // }
            // cities.sort();
            // for (var i=0; i < cities.length; i++) {
            //     rez[i] = {name:cities[i]};
            // }
            // resolve(rez);
        }) 
    })

}

export {
    delayPromise,
    loadAndSortTowns
};
