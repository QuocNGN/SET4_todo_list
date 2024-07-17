const taskInput = document.querySelector('.task-input input');
const taskBox = document.querySelector('.task-box');
const selectFilters = document.querySelector('.filter select');
const emptyImage = document.querySelector('.empty-image');
const addButton = document.querySelector('.add-button');
const resetButton = document.querySelector('.reset-button');

let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem('todo-list')) || [];
let currentFilter = 'all'; // Add this variable to store the current filter

// show task with  selected
selectFilters.addEventListener('change', (event) => {
  const selected = event.target.value;
  currentFilter = selected;
  showTodo();
});

function showTodo() {
  let li = '';
  if (todos.length > 0) {
    todos.forEach((todo, id) => {
      //if todo status is completed, set the isCompleted value to checked
      let isCompleted = todo.status == 'completed' ? 'checked' : '';
      if (currentFilter == todo.status || currentFilter == 'all') {
        li += ` <li class="task">
                    <label for="${id}">
                        <input type="checkbox" id="${id}" onclick="updateStatus(this)" ${isCompleted}>
                        <span class=${isCompleted}>${todo.name}</span>
                        <button onclick="editTask(${id}, '${todo.name}')">Edit</button>
                        <button onclick="deleteTask(${id})">Delete</button>
                    </label>
                </li>`;
      }
    });
  }

  taskBox.innerHTML =
    li ||
    `<img src="asset/no-task.png" alt="" class="empty-image" width="150">`;
}
showTodo();

function updateStatus(selectedTask) {
  //getting paragraph contains task name
  let taskName = selectedTask.nextElementSibling;
  if (selectedTask.checked) {
    taskName.classList.add('checked');
    //updating the status of selected task to completed
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    //updating the status of selected task to pending
    todos[selectedTask.id].status = 'pending';
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo(); // Show the list again after updating the status
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  addButton.textContent = 'Save'; // Change the "Add" button content to "Save"
}

function deleteTask(deleteId) {
  // removing selected task from array/todos
  isEditedTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo(); // Show the list again after deleting the job
}

function handleAddTask() {
  let userTask = taskInput.value.trim();
  if (userTask) {
    if (!isEditedTask) {
      // if todos isn't exist, pass am empty array to todos
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userTask, status: 'pending' };
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
      addButton.textContent = 'Add'; // Change the content of the "Save" button to "Add"
    }
    taskInput.value = '';
    // let taskInfo = { name: userTask, status: 'pending' };
    // todos.push(taskInfo);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo();
  }
}

addButton.addEventListener('click', handleAddTask);

taskInput.addEventListener('keyup', (e) => {
  if (e.key == 'Enter') {
    handleAddTask();
  }
});

resetButton.addEventListener('click', () => {
  taskInput.value = '';
  isEditedTask = false; // When Cancel is pressed, reset isEditedTask to false
  addButton.textContent = 'Add'; // Change the content of the "Save" button to "Add".
});
