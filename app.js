
const taskTitleInput = document.getElementById('task-title');
const taskDateInput = document.getElementById('task-date');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');


document.addEventListener('DOMContentLoaded', getTasks);
addTaskButton.addEventListener('click', addTask);
taskList.addEventListener('click', modifyTask);
completedTaskList.addEventListener('click', modifyTask);


function addTask() {
    const taskTitle = taskTitleInput.value;
    const taskDate = taskDateInput.value;
    if (taskTitle === '' || taskDate === '') {
        alert('Please enter a task title and due date');
        return;
    }

    const task = {
        id: Date.now().toString(),
        title: taskTitle,
        date: taskDate,
        completed: false
    };

    saveTask(task);
    renderTask(task);

    taskTitleInput.value = '';
    taskDateInput.value = '';
}

function showTask(task) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    taskElement.setAttribute('data-id', task.id);

    taskElement.innerHTML = `
        <span>${task.title} - ${task.date}</span>
        <div>
            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    if (task.completed) {
        taskElement.classList.add('completed');
        completedTaskList.appendChild(taskElement);
    } else {
        taskList.appendChild(taskElement);
    }
}

function modifyTask(event) {
    const button = event.target;
    const taskElement = button.parentElement.parentElement;
    const taskId = taskElement.getAttribute('data-id');

    if (button.classList.contains('complete-btn')) {
        toggleTaskComplete(taskId);
    } else if (button.classList.contains('edit-btn')) {
        editTask(taskId);
    } else if (button.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}

function markTaskComplete(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasksToLocalStorage(tasks);
    refreshTasks();
}

function editTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    const task = tasks.find(task => task.id === taskId);

    const newTitle = prompt('Edit Task Title:', task.title);
    const newDate = prompt('Edit Task Due Date:', task.date);

    if (newTitle && newDate) {
        task.title = newTitle;
        task.date = newDate;
        saveTasksToLocalStorage(tasks);
        refreshTasks();
    }
}

function deleteTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(tasks);
    refreshTasks();
}

function saveTask(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => renderTask(task));
}

function refreshTasks() {
    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';
    getTasks();
}
