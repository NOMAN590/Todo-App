const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

async function fetchTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    listContainer.innerHTML = '';
    tasks.forEach(task => {
        let li = document.createElement("li");
        li.innerText = task.task;
        li.dataset.id = task.id;

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.onclick = () => deleteTask(task.id);
        li.appendChild(span);

        listContainer.appendChild(li);
    });
}

async function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: inputBox.value })
    });

    inputBox.value = '';
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE'
    });
    fetchTasks();
}
fetchTasks();
