// Variáveis e Seletores iniciais
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');

// Seletores para os filtros
const filterAll = document.getElementById('filter-all');
const filterPending = document.getElementById('filter-pending');
const filterDone = document.getElementById('filter-done');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Função para salvar no Local Storage (ajustar conforme sua implementação)
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para criar o HTML de uma tarefa (adicionando botões de edição e status)
function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('todo-list-item');
    if (task.done) {
        li.classList.add('done');
    }
    li.dataset.id = task.id; // Usar data-id para referência

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        
        <div class="task-actions">
            <button class="btn btn-action btn-check">✅</button>
            <button class="btn btn-action btn-edit">✍️</button>
            <button class="btn btn-action btn-delete">❌</button>
        </div>

        <div class="edit-form">
            <input type="text" value="${task.text}" class="edit-input">
            <button class="btn btn-save">Salvar</button>
        </div>
    `;
    return li;
}

// Função para renderizar a lista (necessária para os filtros)
function renderTasks() {
    todoList.innerHTML = ''; // Limpa a lista
    
    // Filtra as tarefas
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') {
            return !task.done;
        }
        if (currentFilter === 'done') {
            return task.done;
        }
        return true; // 'all'
    });

    // Adiciona as tarefas filtradas
    filteredTasks.forEach(task => {
        todoList.appendChild(createTaskElement(task));
    });
}

// Inicializa a lista ao carregar a página
renderTasks();

// Evento para Adicionar Tarefa (TaskForm)
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        };
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks(); // Renderiza novamente com a nova tarefa
    }
});