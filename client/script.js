const input = document.querySelector("#todo_input");
const addBtn = document.querySelector("#add_btn");
const list = document.querySelector("#todo_list");
let todos = [];
// 날짜 표시
const today = new Date();
const year = today.getFullYear();
const shortyear = year % 100;
const month = (today.getMonth() + 1).toString().padStart(2,"0");
const day = today.getDate().toString().padStart(2,"0");
const formattedDate = `${shortyear}/${month}/${day}`;
const Title = document.querySelector(".title")
Title.textContent = formattedDate;

const BASE_URL =
    window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://todo-gyum.vercel.app";

const loadTodosFromServer = async () => {
    const res = await fetch(`${BASE_URL}/todos`);
    const serverTodos = await res.json();

    todos = serverTodos.map(todo => ({
        id: todo.id,
        text: todo.title,
        completed: todo.completed
    }));
    renderTodos();
};

loadTodosFromServer();

list.addEventListener("click", async function(e) {
    const li = e.target.closest("li");
    if(!li) return;
    const index = li.dataset.index;

    if (e.target.classList.contains("del_btn")) {
        const todo = todos[index];
        await fetch(`${BASE_URL}/todos/${todo.id}`, {
            method: 'DELETE'
        });
        todos.splice(index, 1);
        renderTodos();
    }

    if (e.target.tagName === "SPAN") {
        todos[index].completed = !todos[index].completed;   
        e.target.classList.toggle("completed");

        const todo = todos[index];
        await fetch(`${BASE_URL}/todos/${todo.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ title: todo.text, completed: todo.completed ? 1 : 0})
        });
    }
});

function renderTodos() {
    list.innerHTML = "";

    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;

        const span = document.createElement("span");
        span.textContent = todo.text;
        if(todo.completed) span.classList.add("completed");
        
        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.classList.add("del_btn");

        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    });    
}

async function addTodo() {
    const text = input.value;
    if(!text) return;

    const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text })   
    });

    const newTodo = await res.json();
    todos.push({ text: newTodo.title, completed: newTodo.completed, id: newTodo.id });
    renderTodos();
    input.value = "";
}

addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function(e) {
    if(e.key === "Enter") addTodo();
});


const showHistoryBtn = document.querySelector("#show_history");
const saveBtn = document.querySelector("#save_btn");
const historyContainer= document.querySelector("#history_container");
const historyOverlay = document.querySelector("#history_overlay");
const closeBtn = document.getElementById('close_history');
// save snapshot
saveBtn.addEventListener("click", async () => {
    const snapshot = {
        title: Title.textContent,
        todos: todos.map(todo => ({...todo}))
    };

    const res = await fetch(`${BASE_URL}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
    });
    const savedSnapshot = await res.json();
    alert(`Snapshot saved!`);
});
// show history overlay
showHistoryBtn.addEventListener("click", async () => {
    const res = await fetch(`${BASE_URL}/snapshots`);
    const history = await res.json();

    historyContainer.innerHTML = "";

    history.forEach((snapshot, index) => {
        const card = document.createElement("div");
        card.classList.add("history_card");

        const closeCardBtn = document.createElement("button");
        closeCardBtn.textContent = "✕";
        closeCardBtn.classList.add("card_close_btn");
        closeCardBtn.addEventListener("click", async () => {
            await fetch(`${BASE_URL}/snapshots/${snapshot.id}`, { method: 'DELETE' })
            card.remove();
        });
        card.appendChild(closeCardBtn);

        const h3 = document.createElement("h3");
        h3.classList.add("history_title");
        h3.textContent = snapshot.title;
        card.appendChild(h3);

        const ul = document.createElement("ul");
        ul.classList.add("history_list");

        (JSON.parse(snapshot.todos) || []).forEach(todo => {
            const li = document.createElement("li");     
            const span = document.createElement("span");
            span.textContent = todo.text;
            if(todo.completed) span.classList.add("completed");
            li.appendChild(span);
            ul.appendChild(li);
        });
        card.appendChild(ul);
        historyContainer.prepend(card);
    });
    historyOverlay.style.display = "flex";
});

// close overlay
closeBtn.addEventListener('click', () => {
    historyOverlay.style.display = 'none'; // overlay 숨기기
});

// horizontal drag for history cards
let isDown = false, startX, scrollLeft;
historyContainer.addEventListener("mousedown", e => {
    isDown = true;
    historyContainer.style.cursor = "grabbing";
    startX = e.pageX - historyContainer.offsetLeft;
    scrollLeft = historyContainer.scrollLeft;
});
historyContainer.addEventListener("mouseleave", () => { isDown = false; historyContainer.style.cursor="grab"; });
historyContainer.addEventListener("mouseup", () => { isDown = false; historyContainer.style.cursor="grab"; });
historyContainer.addEventListener("mousemove", e => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - historyContainer.offsetLeft;
    const walk = (x - startX) * 2;
    historyContainer.scrollLeft = scrollLeft - walk;
});
