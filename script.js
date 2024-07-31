const input = document.querySelector("input");
const addBtn = document.querySelector("#addBtn");
const tasksEl = document.querySelector(".tasks");
const popupEl = document.querySelector(".done-popup")

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
updateDOM()

input.focus()

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});
addBtn.addEventListener("click", addTask)

function localStorageSet() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
        console.error("Failed to save tasks to localStorage:", e);
    }
}


function addTask() {
    let taskValue = input.value;
    if (taskValue !== "" && taskValue.length >= 3) {
        const task = {text: taskValue, done: false}
        tasks.push(task);
        localStorageSet()
        updateDOM();
        input.value = ""; 
    } else {
        alert("Please enter a task (min. 3 characters)")
    }    
}

function updateDOM() {
    tasksEl.innerHTML = "";
    tasks.forEach((task, idx) => {
        const taskDiv = document.createElement("div");
        const p = document.createElement("p");
        const deleteBtn = document.createElement("button");
        const doneBtn = document.createElement("button");

        tasksEl.appendChild(taskDiv);
        taskDiv.appendChild(p);
        taskDiv.appendChild(doneBtn);
        taskDiv.appendChild(deleteBtn);

        taskDiv.classList.add("task");
        p.innerHTML = idx+1 + ". " + task.text;

        if (task.done) {
            p.classList.add("done");
        } else {
            p.classList.remove("done");
        }

        doneBtn.classList.add("fa-solid", "fa-check");
        deleteBtn.classList.add("fa-solid", "fa-trash");

        doneBtn.classList.add("doneBtn");
        deleteBtn.classList.add("deleteBtn");

        deleteBtn.addEventListener("click", () => {
            tasks.splice(idx, 1);
            localStorageSet();
            updateDOM();
            showPopup("deleted");
        });

        doneBtn.addEventListener("click", () => {
            tasks[idx].done = !tasks[idx].done;
            localStorageSet();
            updateDOM();
            showPopup("completed", tasks[idx].done);
        });
    });
}

function showPopup(result, isCompleted = false) {
    let message = "";
    let smallMessage = "";

    switch(result) {
        case 'added':
            message = "Task was added";
            smallMessage = "Added Task";
            break;
        case 'deleted':
            message = "Task was deleted";
            smallMessage = "Deleted Task";
            break;
        case 'completed':
            if (isCompleted) {
                message = "Done!";
                smallMessage = "Completed Task";
            } else {
                message = "Not Done";
                smallMessage = "Task was not completed";
            }
            break;
        default:
            message = "Unknown operation";
            smallMessage = "";
    }

    popupEl.innerHTML = `
        ${message} <br>
        <small>${smallMessage}</small>
    `;
    popupEl.style.top = "50px";
    setTimeout(() => {
        popupEl.style.top = "-50px";
    }, 2000);
}

// === Filtration ===
const allRadio = document.querySelector("#all")
const pendingRadio = document.querySelector("#pending")

function filterPending() {
    pendingRadio.addEventListener("click", () => {
        tasksEl.innerHTML = ""
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].done) {
                tasksEl.innerHTML += `
                    <div class="task">
                        <p>${i + 1}. ${tasks[i].text}</p>
                        <h4 style="text-align: right; color: white;">Status: <em>Pending</em></h4>
                    </div>
                `
            }
        }
    })

    allRadio.addEventListener("click", () => {
        updateDOM()
    })
}

filterPending()