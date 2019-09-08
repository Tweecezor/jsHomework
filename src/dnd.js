/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    var div = document.createElement('div');
    var width = document.body.offsetWidth;

    var height = document.body.offsetHeight;

    div.style.width = `${Math.random()*(width-0) + 0}px `;
    div.style.height = `${Math.random()*(height-0) + 0}px `;
    div.style.position = 'relative';
    div.style.left = `${Math.round(Math.random()*(width-0) + 0)}px`;
    div.style.top = `${Math.round(Math.random()*(height-0) + 0)}px`;
    div.style.background = `rgb(${Math.round(Math.random()*255)}, 
        ${Math.round(Math.random()*(255-0)+0)}, 
        ${Math.round(Math.random()*(255-0)+0)}
    )`;
    div.classList.add('draggable-div');
    div.setAttribute('draggable', 'true');

    return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    var prevPosLeft;

    var prevPosTop;

    var diffLeft;

    var diffTop;

    target.addEventListener ('dragstart', (e)=> {
        target.style.opacity = '0.5';
        prevPosLeft = parseInt(target.style.left);
        prevPosTop = parseInt(target.style.top);
        diffLeft = prevPosLeft - e.clientX;
        diffTop = prevPosTop - e.clientY;
    })
 
    target.addEventListener('dragend', (e)=> {
        target.style.opacity = '1';

        var newPosLeft = e.clientX + diffLeft;

        var newPosTop = e.clientY + diffTop;

        target.style.left = `${newPosLeft}px`;
        target.style.top = `${newPosTop}px`;
    })
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);

    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
