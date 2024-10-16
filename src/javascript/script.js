// Evento para quando o arrasto começar (delegação de evento para o contêiner pai)
document.querySelector('.kanban').addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('kanban-card')) {
        e.target.classList.add('dragging');
    }
});

// Evento para quando o arrasto terminar
document.querySelector('.kanban').addEventListener('dragend', function (e) {
    if (e.target.classList.contains('kanban-card')) {
        e.target.classList.remove('dragging');
    }
});

// Permite que os cartões sejam soltos nas colunas
document.querySelectorAll('.kanban-cards').forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        e.currentTarget.classList.add('cards-hover');
    });

    column.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('cards-hover');
    });

    column.addEventListener('drop', e => {
        e.currentTarget.classList.remove('cards-hover');

        const dragCard = document.querySelector('.kanban-card.dragging');
        e.currentTarget.appendChild(dragCard);
    });
});

// Função para salvar o estado das colunas e cartões no localStorage
function saveState() {
    const columns = document.querySelectorAll('.kanban-column');
    const state = [];

    columns.forEach(column => {
        const columnId = column.getAttribute('data-id');
        const cards = column.querySelectorAll('.kanban-card');
        const cardData = [];

        cards.forEach(card => {
            const priority = card.querySelector('.badge').classList[1];
            const title = card.querySelector('.card-title').innerText;

            cardData.push({
                title: title,
                priority: priority
            });
        });

        state.push({
            columnId: columnId,
            cards: cardData
        });
    });

    localStorage.setItem('kanbanState', JSON.stringify(state));
}

// Função para restaurar o estado das colunas e cartões do localStorage
function loadState() {
    const savedState = localStorage.getItem('kanbanState');

    if (savedState) {
        const state = JSON.parse(savedState);

        state.forEach(columnState => {
            const column = document.querySelector(`.kanban-column[data-id="${columnState.columnId}"]`);
            const cardContainer = column.querySelector('.kanban-cards');
            cardContainer.innerHTML = ''; // Limpa os cartões existentes

            columnState.cards.forEach(cardData => {
                const newCard = document.createElement('div');
                newCard.classList.add('kanban-card');
                newCard.setAttribute('draggable', 'true');

                newCard.innerHTML = `
                    <div class="badge ${cardData.priority}">
                        <span class="priority-text">${getPriorityText(cardData.priority)}</span>
                    </div>
                    <p class="card-title" contenteditable="true">${cardData.title}</p>
                    <div class="card-infos">
                        <div class="card-icons">
                            <p><i class="fa-regular fa-comment"></i> 0</p>
                            <p><i class="fa-solid fa-paperclip"></i> 0</p>
                        </div>
                        <button class="trash"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;

                // Eventos para editar prioridade, título e excluir cartões
                addCardEvents(newCard);

                cardContainer.appendChild(newCard);
            });
        });
    }
}

// Função para obter o texto da prioridade
function getPriorityText(priority) {
    switch (priority) {
        case 'high':
            return 'Alta prioridade';
        case 'medium':
            return 'Prioridade média';
        case 'low':
            return 'Baixa prioridade';
        default:
            return 'Alta prioridade';
    }
}

// Adiciona eventos a cada novo cartão
function addCardEvents(card) {
    // Evento de clique para alterar a prioridade
    const badgeText = card.querySelector('.priority-text');
    const badge = card.querySelector('.badge');

    badgeText.addEventListener('click', function () {
        const prioritySelect = document.createElement('select');
        prioritySelect.style.display = 'block';
        prioritySelect.innerHTML = `
            <option value="high" class="high">Alta prioridade</option>
            <option value="medium" class="medium">Prioridade média</option>
            <option value="low" class="low">Baixa prioridade</option>
        `;

        prioritySelect.value = badge.classList[1];
        badgeText.parentElement.replaceChild(prioritySelect, badgeText);
        prioritySelect.focus();

        // Após a alteração da prioridade, salva o estado
        prioritySelect.addEventListener('change', function () {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;

            badgeText.innerText = selectedText;
            badge.className = 'badge ' + selectedValue;
            this.parentElement.replaceChild(badgeText, this);

            saveState(); // Salva o estado após a mudança de prioridade
        });

        // Fecha o select ao perder o foco e também salva o estado
        prioritySelect.addEventListener('blur', function () {
            const currentClass = badge.classList[1];
            const currentText = badgeText.innerText;
            this.parentElement.replaceChild(badgeText, this);
            badge.className = 'badge ' + currentClass;
            badgeText.innerText = currentText;

            saveState(); // Salva o estado ao perder o foco do select
        });
    });

    // Evento para salvar alterações no título
    const title = card.querySelector('.card-title');
    title.addEventListener('input', function () {
        saveState(); // Salva o estado ao editar o título
    });

    // Evento para excluir o cartão
    const trashButton = card.querySelector('.trash');
    trashButton.addEventListener('click', function () {
        card.remove();
        saveState(); // Salva o estado após a exclusão
    });

    // Salva o estado ao arrastar os cartões
    card.addEventListener('dragend', saveState);
}


// Função para criar um novo cartão
function createCard() {
    const column = this.closest('.kanban-column');

    const newCard = document.createElement('div');
    newCard.classList.add('kanban-card');
    newCard.setAttribute('draggable', 'true');

    newCard.innerHTML = `
        <div class="badge high">
            <span class="priority-text">Alta prioridade</span>
        </div>
        <p class="card-title" contenteditable="true">Nova Tarefa</p>
        <div class="card-infos">
            <div class="card-icons">
                <p><i class="fa-regular fa-comment"></i> 0</p>
                <p><i class="fa-solid fa-paperclip"></i> 0</p>
            </div>
            <button class="trash"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    addCardEvents(newCard);
    column.querySelector('.kanban-cards').appendChild(newCard);

    saveState(); // Salva o estado ao adicionar um novo cartão
}

// Adiciona eventos aos botões de adicionar cartão
document.querySelectorAll('.add-card').forEach(button => {
    button.addEventListener('click', createCard);
});

// Inicializa o estado da página ao carregar
document.addEventListener('DOMContentLoaded', function () {
    loadState(); // Carrega o estado do localStorage
    document.querySelectorAll('.kanban-card').forEach(addCardEvents);
});

// Eventos de arrastar e soltar para salvar o estado
document.querySelectorAll('.kanban-cards').forEach(column => {
    column.addEventListener('drop', saveState);
});
