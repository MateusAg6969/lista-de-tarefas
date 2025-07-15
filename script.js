// Aguarda o carregamento completo do DOM para garantir que todos os elementos estejam disponíveis
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE TEMAS ---

    // Seleciona o botão responsável por alternar os temas
    const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
    // Array com os nomes das classes de tema disponíveis
    const themes = ['light-theme', 'dark-theme', 'daltonic-theme', 'pink-theme']; // Certo!
    // Mapeamento de cada tema para um ícone correspondente (pode ser emoji ou caractere especial)
    const themeIcons = {
        'light-theme': '☀️',
        'dark-theme': '🌙',
        'daltonic-theme': '👀',
        'pink-theme': '💮', // Certo!
    };
    // Índice que indica qual tema está ativo no momento
    let currentThemeIndex = 0;

    // Função que aplica o tema selecionado ao <body> e salva a escolha no localStorage
    function applyTheme(themeName) {
        document.body.className = ''; // Remove todas as classes antigas do body
        document.body.classList.add(themeName); // Adiciona a classe do novo tema
        themeSwitcherBtn.innerHTML = themeIcons[themeName]; // Atualiza o ícone do botão
        localStorage.setItem('theme', themeName); // Persiste a escolha do tema
    }
    
    // Evento de clique no botão de tema: alterna para o próximo tema do array
    themeSwitcherBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length; // Gira o índice circularmente
        const newTheme = themes[currentThemeIndex];
        applyTheme(newTheme); // Aplica o novo tema
    });
    
    // Ao carregar, verifica se há um tema salvo no localStorage; se não, usa o tema claro
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    currentThemeIndex = themes.indexOf(savedTheme);
    if (currentThemeIndex === -1) {
        currentThemeIndex = 0; // Garante que o índice é válido
    }
    applyTheme(themes[currentThemeIndex]); // Aplica o tema inicial

    // --- LÓGICA DA LISTA DE TAREFAS ---

    // Seleciona os elementos principais da interface de tarefas
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Função que salva todas as tarefas atuais no localStorage
    function saveTasks() {
        const tasks = [];
        // Para cada <li> da lista, salva o texto e se está concluída
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Salva como JSON
    }

    // Função que carrega as tarefas do localStorage e as adiciona na lista
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    // Função para adicionar uma nova tarefa à lista
    // Se 'text' não for passado, pega do input
    // 'completed' indica se a tarefa já está concluída
    function addTask(text, completed = false) {
        const taskText = (text !== undefined ? text : taskInput.value).trim();
        if (!taskText) return; // Não adiciona tarefas vazias

        // Cria o elemento <li> da tarefa
        const li = document.createElement('li');
        if (completed) {
            li.classList.add('completed'); // Marca como concluída se necessário
        }

        // Define o HTML interno do <li> (texto e botões)
        li.innerHTML = `
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="complete-btn" title="Concluir">✓</button>
                <button class="repeat-btn" title="Repetir">↻</button>
                <button class="delete-btn" title="Excluir">✕</button>
            </div>
        `;
        taskList.appendChild(li); // Adiciona o <li> na lista
        
        // Limpa o campo de input se a tarefa foi digitada manualmente
        if (text === undefined) {
            taskInput.value = '';
        }
        
        saveTasks(); // Salva o estado atualizado
    }

    // Adiciona tarefa ao clicar no botão "+"
    addTaskBtn.addEventListener('click', () => addTask());

    // Adiciona tarefa ao pressionar Enter no campo de input
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Delegação de eventos para os botões de ação das tarefas
    // Permite lidar com clique em qualquer botão dentro da lista
    taskList.addEventListener('click', (e) => {
        // Busca o <li> mais próximo do alvo do clique
        const li = e.target.closest('li');
        if (!li) return; // Se não clicou em um item da lista, ignora

        // Se clicou no botão de excluir, remove a tarefa
        if (e.target.classList.contains('delete-btn')) {
            li.remove();
        // Se clicou no botão de concluir ou no texto da tarefa, alterna o status de concluída
        } else if (e.target.classList.contains('complete-btn') || e.target.tagName === 'SPAN') {
            li.classList.toggle('completed');
        // Se clicou no botão de repetir, adiciona uma nova tarefa igual
        } else if (e.target.classList.contains('repeat-btn')) {
            const span = li.querySelector('span');
            if (span) {
                addTask(span.textContent);
            }
        }
        
        // Após qualquer ação, salva o novo estado das tarefas
        saveTasks();
    });

    // Ao carregar a página, carrega as tarefas salvas anteriormente
    loadTasks();
});