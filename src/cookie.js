/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"

    clearTable();
    var inputName = addNameInput.value;
    var inputValue = addValueInput.value;
    console.log(document.cookie);
    document.cookie = `${inputName}=${inputValue}`;
    addNameInput.value = '';
    addValueInput.value = '';
    // console.log( document.cookie);
    // console.log(takeCokkie());
    // createTableField(inputName,inputValue);
    createCookieTable();
});
// function addNewCookie() {
//     createTableField(item,cookie[item]);
// }
function createCookieTable() {
    var cookie = takeCokkie();
    console.log(cookie);
    // console.log(cookie);
   
    // console.log(cookie);
    // console.log(JSON.stringify(cookie));
    // console.log(cookie);
    for (var item in cookie) {
        if (cookie[item] != undefined) {
            createTableField( item, cookie[item] );
        }
    }
   
    // listTable.append(tableNewLine);
    // tableNewLine.append(tableName);
    // tableNewLine.append(tableValue);
    // tableNewLine.append(tableDelete);
   
}

function createTableField(name,value,sameName){
    var tableNewLine = document.createElement('tr');

    var tableName = document.createElement('td');

    var tableValue = document.createElement('td');

    var tableDelete = document.createElement('button');
   
    tableValue.innerHTML = value;
    tableName.innerHTML = name;
    tableDelete.innerHTML = 'Push'
    listTable.append(tableNewLine);
    tableNewLine.append(tableName);
    tableNewLine.append(tableValue);
    tableNewLine.append(tableDelete);

    tableDelete.addEventListener('click',(e)=>{
        // console.log(e.target.parentNode);
        // console.log(document.cookie);
        // console.log(tableName.innerHTML);
        // console.log(tableValue);
        document.cookie = `${tableName.innerHTML}=${tableValue.innerHTML};expires=Thu, 01 Jan 1970 00:00:01 GMT"`;
        listTable.removeChild(e.target.parentNode);
        // console.log(tableValue);
        // console.log(document.cookie);
       
       
    })
}

function takeCokkie(){
   return document.cookie.split('; ').reduce((prev,current)=>{
        var [name,value] = current.split('=');

        prev[name] = value;
        return prev;
        },{})
}
createCookieTable();

function clearTable(){
    // debugger;
    console.log(document.cookie);
    var lengthOfChild = listTable.children.length
    for(var i =0; i<lengthOfChild; i++) {
        listTable.removeChild(listTable.firstElementChild);
    }   
    console.log(document.cookie);
}
