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

    var i;

    var prev;

    if (initial == undefined) {
        prev = array[0]; 
        i=1;
    } else {
        prev = initial;
        i=0;
    }  
    for ( ; i<array.length; i++) {
        prev = fn(prev, array[i], i, array);
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
function createProxy(obj) {
    return obj = new Proxy(obj, {
        set(target, prop, value) {
            target[prop] = value * value;

            return true;
        }
    })
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
