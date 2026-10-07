const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');

// Fetch and render all tasks
async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  render(tasks);
}

// Render task list
function render(tasks) {
  list.innerHTML = '';
  emptyMsg.style.display = tasks.length ? 'none' : 'block';

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.onclick = () => toggleTask(task.id);

    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'delete-btn';
    del.onclick = () => deleteTask(task.id);

    li.append(span, del);
    list.appendChild(li);
  });
}

// Add task
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  input.value = '';
  loadTasks();
});

// Toggle done
async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'PATCH' });
  loadTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Initial load
loadTasks();
