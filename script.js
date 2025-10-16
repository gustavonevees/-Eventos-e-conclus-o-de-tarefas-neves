// Seleção de elementos do DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksList = document.getElementById('tasks-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// --- CÓDIGO DA AULA PASSADA (Função addTask e Evento de Submit) ---
taskForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Previne o recarregamento da página
    const taskText = taskInput.value.trim();

    if (taskText) {
        addTask(taskText);
        taskInput.value = ''; // Limpa o input
    }
});

// Função para criar o HTML de um novo item da lista
function addTask(text, isCompleted = false) {
    const li = document.createElement('li');
    
    // Adiciona a classe 'completed' se a tarefa estiver concluída
    if (isCompleted) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <div class="task-actions">
            <button class="complete-btn">${isCompleted ? 'Desfazer' : 'Concluir'}</button>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
        </div>
    `;

    tasksList.appendChild(li);
    // Nota: Por simplicidade, este exemplo não está usando Local Storage. 
    // Em um app real, você salvaria a tarefa aqui.
}

// --- NOVO CÓDIGO (Delegação de Eventos, Marcar, Editar) ---

/**
 * Delegação de Eventos: 
 * Adiciona um único 'click' listener ao elemento pai (tasksList - a <ul>).
 * Quando um clique ocorre, ele verifica qual elemento filho (botão) foi clicado 
 * e executa a função apropriada. Isso funciona para tarefas adicionadas 
 * dinamicamente!
 */
tasksList.addEventListener('click', function(e) {
    const target = e.target;
    // Encontra o item <li> mais próximo para saber em qual tarefa estamos agindo
    const listItem = target.closest('li'); 
    
    if (!listItem) return; // Se não for clicado em um LI, ignora

    // 1. Marcar como Concluída / Desfazer
    if (target.classList.contains('complete-btn')) {
        toggleCompleteTask(listItem, target);
    }
    
    // 2. Editar Tarefa
    else if (target.classList.contains('edit-btn')) {
        editTask(listItem);
    }

    // 3. Excluir Tarefa (Opcional, mas útil)
    else if (target.classList.contains('delete-btn')) {
        listItem.remove();
        // Opcional: Aqui você removeria do Local Storage/BD
    }
});

/**
 * Função para alternar entre Concluída/Pendente
 * @param {HTMLLIElement} listItem - O elemento <li> da tarefa.
 * @param {HTMLButtonElement} button - O botão que foi clicado.
 */
function toggleCompleteTask(listItem, button) {
    listItem.classList.toggle('completed');
    // Atualiza o texto do botão
    if (listItem.classList.contains('completed')) {
        button.textContent = 'Desfazer';
    } else {
        button.textContent = 'Concluir';
    }
    // Opcional: Aqui você atualizaria o status no Local Storage/BD
    applyFilter(document.querySelector('.filter-btn.active').dataset.filter); // Reaplica o filtro
}

/**
 * Função para entrar no modo de edição
 * @param {HTMLLIElement} listItem - O elemento <li> da tarefa.
 */
function editTask(listItem) {
    const textSpan = listItem.querySelector('.task-text');
    const actionsDiv = listItem.querySelector('.task-actions');
    const currentText = textSpan.textContent;
    
    // Remove o texto e os botões de ação para adicionar o campo de input
    textSpan.style.display = 'none';
    actionsDiv.style.display = 'none';

    // Cria o campo de edição
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('edit-input');
    editInput.value = currentText;
    
    // Cria o botão Salvar
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.classList.add('save-edit-btn');
    
    // Insere os novos elementos no LI
    listItem.prepend(editInput);
    listItem.appendChild(saveButton);

    editInput.focus();

    // Evento para Salvar a Edição
    saveButton.addEventListener('click', function() {
        saveEdit(listItem, editInput, textSpan, actionsDiv, saveButton);
    });
    
    // Evento para salvar ao pressionar Enter no campo de edição
    editInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit(listItem, editInput, textSpan, actionsDiv, saveButton);
        }
    });
}

/**
 * Função para salvar a edição
 */
function saveEdit(listItem, editInput, textSpan, actionsDiv, saveButton) {
    const newText = editInput.value.trim();
    
    if (newText) {
        textSpan.textContent = newText;
        // Volta ao estado normal
        textSpan.style.display = 'inline';
        actionsDiv.style.display = 'flex';
        
        // Remove os elementos de edição
        editInput.remove();
        saveButton.remove();
        
        // Opcional: Aqui você atualizaria o texto no Local Storage/BD
    } else {
        alert('O texto da tarefa não pode ser vazio!');
        editInput.focus();
    }
}

// --- NOVO CÓDIGO (Filtros) ---

/**
 * Adiciona eventos aos botões de filtro. 
 * A delegação não é necessária aqui, pois os botões não são criados dinamicamente.
 */
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove a classe 'active' de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona a classe 'active' ao botão clicado
        button.classList.add('active');
        
        const filterType = button.dataset.filter; // Pega o valor do atributo data-filter (all, pending, completed)
        applyFilter(filterType);
    });
});

/**
 * Função principal para aplicar o filtro.
 * @param {string} filterType - O tipo de filtro ('all', 'pending', 'completed').
 */
function applyFilter(filterType) {
    const tasks = tasksList.querySelectorAll('li');

    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');

        switch (filterType) {
            case 'all':
                task.classList.remove('hidden'); // Mostra todas
                break;
            case 'completed':
                // Mostra se for concluída, esconde se não for
                if (isCompleted) {
                    task.classList.remove('hidden');
                } else {
                    task.classList.add('hidden');
                }
                break;
            case 'pending':
                // Mostra se NÃO for concluída, esconde se for
                if (!isCompleted) {
                    task.classList.remove('hidden');
                } else {
                    task.classList.add('hidden');
                }
                break;
        }
    });
}


// --- FIM do script.js ---