let todoList = JSON.parse(localStorage.getItem("todoList")) || [
]; //fetching items from local storage and if local storage empty then declaring an array named todolist



displayItems();

function addTodo() {
  let inputElement = document.querySelector('#todo-input');
  let dateElement = document.querySelector('#todo-date');
  let todoItem = inputElement.value;
  let todoDate = dateElement.value;

  if (todoItem.trim() === '') { //it means after removing front and back spaces, entered string is empty, then show alert and return that is exit the function
    alert(" Please enter a task before adding!");
    return;
  }

  todoList.push({item: todoItem, dueDate: todoDate}); //pushes the new entered values into the array, which will be displayed using displayItems()  function
  localStorage.setItem("todoList",JSON.stringify(todoList));
  inputElement.value = '';
  dateElement.value = '';
  displayItems();
}

function displayItems() {
  let containerElement = document.querySelector('.todo-container');
  let newHtml = '';
  for (let i = 0; i < todoList.length; i++) { //running a loop on array  items to display them and delete if delete button is clicked
    let {item, dueDate} = todoList[i];
    newHtml += `
      <span>${item}</span>
      <span>${dueDate}</span>
      <button class='btn-delete' onclick="deleteTodo(${i})">Delete</button>
    `;
  }
  containerElement.innerHTML = newHtml;
  
  localStorage.setItem("todoList",JSON.stringify(todoList));

  let msg=document.querySelector("#no-task");

  if(todoList.length==0){
  msg.innerHTML="<h2> No tasks to show </h2>";
} else{
  msg.innerHTML="";
}

let clearAll=document.querySelector("#clear-all");
if(todoList.length>0){
  clearAll.innerHTML="<button id='clear-button' onclick='clearTasks()'> Clear ALL </button>";
} else {
  clearAll.innerHTML="";
}
}


function deleteTodo(index){
  todoList.splice(index,1);  //it deletes 1 element starting from index
  displayItems();

}

function clearTasks(){
  todoList=[];  //makes the array empty on clicking clear all button
  localStorage.setItem("todoList", JSON.stringify(todoList));
//dont use localStorage.clear() bcos it will clear all the data of other websites too, stored in local storage
displayItems();
}