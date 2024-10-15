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

// Função para criar um novo cartão
function createCard() {
    const column = this.closest('.kanban-column');

    // Cria um novo elemento de cartão
    const newCard = document.createElement('div');
    newCard.classList.add('kanban-card');
    newCard.setAttribute('draggable', 'true'); // Faz o cartão arrastável

    // Adiciona o conteúdo do cartão (exemplo básico)
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
            <div class="user">
                <img src="src/images/usuario3.jpg" alt="avatar">
            </div>
        </div>
    `;

    // Evento de clique para alterar a prioridade
    const badgeText = newCard.querySelector('.priority-text');
    const badge = newCard.querySelector('.badge');
    
    badgeText.addEventListener('click', function () {
        const prioritySelect = document.createElement('select');
        prioritySelect.style.display = 'block'; // Exibe o select sem clique adicional
        prioritySelect.innerHTML = `
            <option value="high" class="high">Alta prioridade</option>
            <option value="medium" class="medium">Prioridade média</option>
            <option value="low" class="low">Baixa prioridade</option>
        `;
        
        prioritySelect.value = badge.classList[1]; // Define o valor inicial baseado na classe da badge
        badgeText.parentElement.replaceChild(prioritySelect, badgeText);
        prioritySelect.focus(); // Abre o menu automaticamente

        // Após a seleção, atualiza a badge e o texto
        prioritySelect.addEventListener('change', function () {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;

            // Atualiza o texto da prioridade e a classe do badge
            badgeText.innerText = selectedText; // Atualiza o texto da prioridade
            badge.className = 'badge ' + selectedValue; // Atualiza a classe do badge

            this.parentElement.replaceChild(badgeText, this); // Substitui o select pelo texto
        });

        // Fecha o select se perder o foco
        prioritySelect.addEventListener('blur', function () {
            const currentClass = badge.classList[1];
            const currentText = badgeText.innerText;
            this.parentElement.replaceChild(badgeText, this);
            badge.className = 'badge ' + currentClass; // Mantém a cor atual
            badgeText.innerText = currentText; // Mantém o texto atual
        });
    });

    // Insere o novo cartão na lista de cartões da coluna
    column.querySelector('.kanban-cards').appendChild(newCard);
}

// Adiciona eventos aos botões de adicionar cartão
document.querySelectorAll('.add-card').forEach(button => {
    button.addEventListener('click', createCard);
});

// Função para permitir a alteração da prioridade nos cartões existentes
document.querySelectorAll('.kanban-card').forEach(card => {
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

        prioritySelect.addEventListener('change', function () {
            const selectedValue = this.value;
            const selectedText = this.options[this.selectedIndex].text;

            badgeText.innerText = selectedText;
            badge.className = 'badge ' + selectedValue;
            this.parentElement.replaceChild(badgeText, this);
        });

        prioritySelect.addEventListener('blur', function () {
            const currentClass = badge.classList[1];
            const currentText = badgeText.innerText;
            this.parentElement.replaceChild(badgeText, this);
            badge.className = 'badge ' + currentClass;
            badgeText.innerText = currentText;
        });
    });
});
