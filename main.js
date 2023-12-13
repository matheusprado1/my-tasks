// Seleciona elementos do DOM usando classes e IDs
const taskList = document.querySelector(".c-tasks__list");
const inputAdd = document.querySelector("#c-insert__input--add");
const buttonAdd = document.querySelector("#c-insert__button--add");
const selectAdd = document.querySelector("#c-insert__select--add");
const inputSearch = document.querySelector(".c-header__input");

// Inicializa dois arrays vazios um chamado 'tasks' e outro "filteredTasks"
let tasks = [];
let filteredTasks = [];


// Define uma função para recarregar a lista de tarefas no DOM
function reloadList() {
  orderedList();

  taskList.innerHTML = "";

  const currentTasks = filteredTasks.length > 0 ? filteredTasks : tasks;

  if (currentTasks.length === 0) {
    displayNoTasksMessage("Nenhuma tarefa encontrada.");
  } else {
    currentTasks.forEach((task) => {
      const tasksItem = createTaskElement(task);
      taskList.appendChild(tasksItem);
    });
  }
}

// Define uma função para ordenar as tarefas com base em sua prioridade
function orderedList() {
  const order = { "urgente": 0, "prioritario": 1, "normal": 2 };

  // Use filteredTasks se houver alguma filtragem, caso contrário, use tasks
  const currentTasks = filteredTasks.length > 0 ? filteredTasks : tasks;

  currentTasks.sort((a, b) => order[a.tipo.toLowerCase()] - order[b.tipo.toLowerCase()]);
}

// Define uma função para exibir uma mensagem quando não há tarefas
function displayNoTasksMessage(message) {
  const noTasksMessage = document.createElement("p");
  noTasksMessage.classList.add("c-tasks__message");
  noTasksMessage.innerText = message;
  taskList.appendChild(noTasksMessage);
}

// Define uma função para criar um elemento de tarefa
function createTaskElement(task) {
  const tasksItem = document.createElement("li");
  tasksItem.classList.add("c-tasks__item");

  const ballColor = getBallColor(task.tipo);
  tasksItem.innerHTML = `<span class="ball" style="background-color: ${ballColor};"></span><p class="c-tasks__item__title">${task.titulo}</p>`;
  tasksItem.appendChild(createRemoveButton(task));

  return tasksItem;
}

// Define uma função para obter a cor da bola com base no tipo da tarefa
function getBallColor(type) {
  const colorMap = { "urgente": "red", "prioritario": "yellow", "normal": "green" };
  return colorMap[type.toLowerCase()];
}

// Define uma função para criar um botão de remoção para cada tarefa
function createRemoveButton(task) {
  const removeButton = document.createElement("button");
  removeButton.classList.add("c-task__button--remove", "fa-solid", "fa-trash");
  removeButton.addEventListener("click", () => {
    tasks = tasks.filter((t) => t !== task);
    filteredTasks = filteredTasks.filter((filteredTask) => filteredTask !== task);
    reloadList();
    inputSearch.value = "";
  });

  return removeButton;
}

// Define uma função para adicionar uma nova tarefa à lista
function addTaskToTheList(title, type) {
  const newTask = { titulo: title, tipo: type };
  tasks.push(newTask);
  filteredTasks = tasks.filter((task) => task.titulo.toLowerCase().includes(inputSearch.value.toLowerCase()));
  orderedList();
  reloadList();
}

// Adiciona um ouvinte de evento ao botão de adicionar tarefa
buttonAdd.addEventListener("click", (event) => {
  event.preventDefault();
  const title = inputAdd.value;
  const type = selectAdd.value;

  if (title && type) {
    addTaskToTheList(title, type);
    inputAdd.value = "";
    selectAdd.selectedIndex = 0;
  }
});

// Adiciona um ouvinte de evento ao campo de pesquisa
inputSearch.addEventListener("input", () => {
  searchTasks(inputSearch.value);
});

// Define uma função para pesquisar tarefas
function searchTasks(query) {
  filteredTasks = tasks.filter(task => task.titulo.toLowerCase().includes(query.toLowerCase()));
  reloadList();
}

// Verifica se há tarefas ao iniciar a página e chama reloadList
reloadList();
