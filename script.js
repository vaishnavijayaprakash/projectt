// app.js — TaskFlow: Complete Task Manager with localStorage

// ── State ──
let tasks = JSON.parse(localStorage.getItem("taskflow")) || [];
let currentFilter = "all";

// ── DOM Elements ──
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const prioritySelect = document.getElementById("task-priority");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const clearDoneBtn = document.getElementById("clear-done");

// ── Save to localStorage ──
function save() {
  localStorage.setItem("taskflow", JSON.stringify(tasks));
}

// ── Update Stats ──
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-active").textContent = total - done;
  document.getElementById("stat-done").textContent = done;
}

// ── Render Task List ──
function render() {
  const query = searchInput.value.toLowerCase();

  // Filter tasks based on current filter & search
  const filtered = tasks.filter(task => {
    if (currentFilter === "active" && task.done) return false;
    if (currentFilter === "done" && !task.done) return false;
    if (query && !task.title.toLowerCase().includes(query)) return false;
    return true;
  });

  // Clear existing list
  listEl.innerHTML = "";

  // Show/hide empty state
  emptyEl.classList.toggle("hidden", filtered.length > 0);

  // Build each task element
  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "done" : ""}`;

    li.innerHTML = `
      <label class="task-left">
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <span class="task-text">${task.title}</span>
      </label>
      <div class="task-meta">
        <span class="priority-badge ${task.priority}">${task.priority}</span>
        <button class="btn-del" title="Delete">&times;</button>
      </div>
    `;

    // Toggle done
    li.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      save();
      render();
      updateStats();
    });

    // Delete task
    li.querySelector(".btn-del").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save();
      render();
      updateStats();
    });

    listEl.appendChild(li);
  });

  updateStats();
}

// ── Add New Task ──
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    priority: prioritySelect.value,
    done: false,
  });

  save();
  render();
  input.value = "";
  input.focus();
});

// ── Search ──
searchInput.addEventListener("input", render);

// ── Filter Buttons ──
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ── Clear Completed ──
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

// ── Initial Render ──
render();