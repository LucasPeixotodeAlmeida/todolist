// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

//"salva" a tarefa que sera editada
let oldInputValue;

// Funções

const saveTodo = (text) => {
    // Verifica se a tarefa já existe
    if (!isTodoAlreadyExist(text)) {
        const todo = document.createElement("div");
        todo.classList.add("todo");

        const todoTitle = document.createElement("h3");
        todoTitle.innerText = text;
        todo.appendChild(todoTitle);

        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-todo");
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        todo.appendChild(doneBtn);

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-todo");
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        todo.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("remove-todo");
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        todo.appendChild(deleteBtn);

        todoList.appendChild(todo);

        // Salva a tarefa no localStorage
        saveTodoToLocalStorage(text);

        todoInput.value = "";
        todoInput.focus();
    } else {
        alert("Esta tarefa já existe!");
    }
};

const isTodoAlreadyExist = (text) => {
    const todos = document.querySelectorAll(".todo");
    for (let todo of todos) {
        const todoTitle = todo.querySelector("h3").innerText;
        if (todoTitle === text) {
            return true;
        }
    }
    return false;
};

const saveTodoToLocalStorage = (text) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    if (!todos.includes(text)) {
        todos.push(text);
        localStorage.setItem("todos", JSON.stringify(todos));
    }
};

const loadTodosFromLocalStorage = () => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach((todoText) => {
        saveTodo(todoText);
    });
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    });

    // Atualiza os dados no localStorage
    updateLocalStorage(oldInputValue, text);
};

const updateLocalStorage = (oldText, newText) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.map((todoText) => {
        if (todoText === oldText) {
            return newText;
        }
        return todoText;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Eventos

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        // Remove do localStorage também
        removeTodoFromLocalStorage(todoTitle);
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// Remove uma tarefa do localStorage
const removeTodoFromLocalStorage = (text) => {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos = todos.filter((todoText) => todoText !== text);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Carrega as tarefas do localStorage quando a página é carregada
document.addEventListener("DOMContentLoaded", loadTodosFromLocalStorage);
