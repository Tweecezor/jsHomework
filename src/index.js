/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach ( array, fn ) {
    for ( var i = 0; i < array.length; i++) {
        fn( array[i], i, array);
    }

}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map ( array, fn ) {
    var newArr = [];

    for ( var i = 0; i<array.length; i++) {
        newArr.push( fn(array[i], i, array) );
    }

    return newArr;
}
/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    var rez;

    var prev;

    if (initial == undefined) {
        prev = array[0];
        for ( var i = 1; i<array.length; i++) {
            prev = fn(prev, array[i], i, array);
        }
    } else {
        prev = initial;
        for ( var j = 0; j<array.length; j++ ) {
            prev = fn(prev, array[j], j, array);
        }
    }   
    rez = prev;

    return rez;
}
/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var arr = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key) ) {
            arr.push(key.toUpperCase());
        }
    }

    return arr;

}
/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to = array.length) {
    if ((from*-1)>array.length) {
        from = 0;
    } else if (from<0) {
        from = array.length + from;
    }
    if (to<0) {
        to = array.length + to;
    }
    if (to>array.length) {
        to = array.length;
    }
   
    var newArr = []

    for ( var i = from; i<to; i++) {
        newArr.push(array[i]);
    }
        
    return newArr;
}
// debugger;
/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
// let numbers= {
//     one : '3',
//     two : '2'
//   };

function createProxy(obj) {
    for (var prop in obj) {
        if (prop in obj) {
            obj[prop] = obj[prop] * obj[prop];
        }
    }

    return obj;
}
// debugger;
// const op = createProxy(numbers);
// op.one = 5;

// console.log(op);
// }
// // debugger;
// const newNumber = new Proxy(numbers,{
//     set(target,prop,value){
//         if(prop in target)
//             target[prop] = target[prop]*target[prop];
//         return true;
//     }
// })
// newNumber.one = 6;
// console.log(newNumber);

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
