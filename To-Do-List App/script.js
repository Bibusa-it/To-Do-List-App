let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoList = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const clearCompletedBtn = document.getElementById('clearCompleted');
const taskCount = document.getElementById('taskCount');

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');

        // Left side: checkbox + text
        const leftDiv = document.createElement('div');
        leftDiv.className = 'todo-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = () => toggleComplete(index);

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = todo.text;
        textInput.className = 'todo-text';
        textInput.setAttribute('readonly', true);

        // Double-click to edit
        textInput.ondblclick = () => {
            textInput.removeAttribute('readonly');
            textInput.focus();
        };

        // Save edit on blur or Enter
        textInput.onblur = () => saveEdit(index, textInput);
        textInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                textInput.blur();
            }
        };

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(textInput);

        // Actions: delete
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'todo-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => deleteTask(index);

        actionsDiv.appendChild(deleteBtn);

        li.appendChild(leftDiv);
        li.appendChild(actionsDiv);

        todoList.appendChild(li);
    });

    updateTaskCount();
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTask(e) {
    if (e) e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

function deleteTask(index) {
    todos.splice(index, 1);
    renderTodos();
}

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function saveEdit(index, input) {
    const newText = input.value.trim();
    if (newText) {
        todos[index].text = newText;
    } else {
        // If empty, delete the task
        todos.splice(index, 1);
    }
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
}

function updateTaskCount() {
    const count = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = count === 1 ? '1 task left' : `${count} tasks left`;
}

// Event listeners
todoForm.addEventListener('submit', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
renderTodos();