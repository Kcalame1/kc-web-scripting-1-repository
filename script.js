let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("categoryInput").value;

  let text = input.value.trim();

  if (text === "") {
    alert("Task cannot be empty");
    return;
  }

  if (tasks.some(t => t.text === text)) {
    alert("Task already exists");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    category,
    completed: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const filter = document.getElementById("filter").value;

  list.innerHTML = "";

  let filtered = tasks;

  if (filter !== "All") {
    filtered = tasks.filter(task => task.category === filter);
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.text} (${task.category})
      </span>
      <button onclick="toggleTask(${task.id})">✔</button>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    list.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  document.getElementById("progress").innerText =
    `${completed} of ${total} tasks completed`;
}

renderTasks();