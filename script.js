
// Aguarda o DOM ser completamente carregado para garantir que todos os elementos HTML estejam disponíveis.
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos principais da interface: o campo de input, o botão de adicionar e a lista de tarefas.
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Função para salvar todas as tarefas atuais no localStorage.
    function saveTasks() {
        const tasks = [];
        // Itera sobre cada item 'li' na lista de tarefas.
        taskList.querySelectorAll('li').forEach(li => {
            // Coleta o texto da tarefa e seu estado de conclusão.
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        // Converte o array de tarefas para uma string JSON e armazena no localStorage.
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar tarefas do localStorage quando a página é aberta.
    function loadTasks() {
        // Obtém as tarefas salvas do localStorage; se não houver, usa um array vazio.
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Para cada tarefa carregada, chama a função addTask para recriá-la na lista.
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    // Função para adicionar uma nova tarefa à lista.
    // Aceita o texto da tarefa e um booleano opcional para o estado de concluída.
    function addTask(text, completed = false) {
        // Usa o texto fornecido ou pega o valor do campo de input. Remove espaços em branco extras.
        const taskText = (text !== undefined ? text : taskInput.value).trim();
        // Se não houver texto, a função não faz nada.
        if (!taskText) return;

        // Cria um novo elemento de lista 'li'.
        const li = document.createElement('li');
        // Adiciona a classe 'completed' se a tarefa já estiver concluída (ao carregar).
        if (completed) {
            li.classList.add('completed');
        }

        // Define o HTML interno do 'li' com o texto da tarefa e os botões de ação.
        li.innerHTML = `
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="complete-btn" title="Concluir">&#10003;</button>
                <button class="repeat-btn" title="Repetir">&#8635;</button>
                <button class="delete-btn" title="Excluir">&#10005;</button>
            </div>
        `;
        // Adiciona o novo 'li' à lista de tarefas 'ul'.
        taskList.appendChild(li);
        
        // Se a tarefa foi adicionada pelo usuário (não carregada do storage), limpa o input.
        if (text === undefined) {
            taskInput.value = '';
        }
        
        // Salva o estado atual da lista no localStorage sempre que uma tarefa é adicionada.
        saveTasks();
    }

    /* --- EVENT LISTENERS --- */

    // Event listener para o clique no botão 'Adicionar'.
    // Quando o botão é clicado, chama a função addTask para criar uma nova tarefa com o texto do input.
    addTaskBtn.addEventListener('click', () => addTask());

    // Event listener para a tecla 'Enter' no campo de input.
    // Quando 'Enter' é pressionado, também chama addTask, facilitando a adição de tarefas.
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event listener único na lista de tarefas (ul) para gerenciar todas as ações dos botões.
    // Isso é chamado de "delegação de eventos" e é mais eficiente do que adicionar um listener para cada botão.
    taskList.addEventListener('click', (e) => {
        // Encontra o elemento 'li' pai mais próximo do elemento que foi clicado.
        const li = e.target.closest('li');
        // Se o clique não foi dentro de um 'li', não faz nada.
        if (!li) return;

        // Se o botão 'Excluir' (com a classe 'delete-btn') foi clicado...
        if (e.target.classList.contains('delete-btn')) {
            // Remove o elemento 'li' da lista.
            li.remove();
            // Salva o novo estado da lista.
            saveTasks();
        // Se o botão 'Concluir' ou o próprio texto da tarefa (span) for clicado...
        } else if (e.target.classList.contains('complete-btn') || e.target.tagName === 'SPAN') {
            // Alterna a classe 'completed', marcando ou desmarcando a tarefa como concluída.
            li.classList.toggle('completed');
            // Salva o novo estado da lista.
            saveTasks();
        // Se o botão 'Repetir' (com a classe 'repeat-btn') foi clicado...
        } else if (e.target.classList.contains('repeat-btn')) {
            // Pega o texto da tarefa atual.
            const span = li.querySelector('span');
            // Se o texto existir, chama addTask para criar uma nova tarefa duplicada.
            if (span) {
                addTask(span.textContent);
                // A chamada para saveTasks() já está dentro de addTask().
            }
        }
    });

    // Carrega as tarefas salvas no localStorage assim que a página é iniciada.
    loadTasks();
});
