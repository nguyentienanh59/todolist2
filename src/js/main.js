const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const todosApi = "https://api-training-xr6q.onrender.com/api/v1";
let idUpdate = null;
let isUpdate = false;
let todos = [];
let currentPage = 1;
let itemsPerPage = 10;

const instance = axios.create({
  baseURL: "https://api-training-xr6q.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response) => {
    const accessToken = response.data.token;
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getTodoAPI() {
  return instance.get("/work");
}

function createTodoAPI(title) {
  return instance.post("/work", {
    title: title,
  });
}
function deleteTodoAPI(id) {
  return instance.delete(`/work/${id}`);
}

function updateTodoAPI(todo) {
  return instance.patch(`/work/${todo._id}`, {
    title: todo.title,
  });
}

function renderUI(arr) {
  todoListEl.innerHTML = "";

  // Kiểm tra mảng rỗng
  if (arr.length == 0) {
    todoListEl.innerHTML = "Không có công việc nào trong danh sách";
    return;
  }

  // Trường hợp có công việc
  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];
    todoListEl.innerHTML += `
            <div class="todo-item ${t.status ? "active-todo" : ""}">
                <div class="todo-item-title">
                    <input
                        type="checkbox"
                        ${t.status ? "checked" : ""}
                        onclick="toggleStatus(${t.id})"
                    />
                    <p>${t.title}</p>
                </div>
                <div class="option">
                    <button class="btn btn-update" onclick="updateTitle(${i})">
                        <img src="./img/pencil.svg" alt="icon" />
                    </button>
                    <button class="btn btn-delete" onclick=deleteTodo(${i})>
                        <img src="./img/remove.svg" alt="icon" />
                    </button>
                </div>
            </div>
        `;
  }
}
async function getTodos() {
  const response = await getTodoAPI();
  todos = response.data;
  renderUI(todos);
}

async function createTodo(title) {
  try {
    const response = await createTodoAPI(title);
    todos.push(response.data.data.work);
    renderUI(todos);
    changePage(1);
    renderPageButtons();
  } catch (error) {
    console.log(error);
  }
}

btnAdd.addEventListener("click", () => {
  let todoTitle = todoInputEl.value;
  if (todoTitle == "") {
    alert("Không được để trống");
    return;
  }
  if (isUpdate) {
    let todo = todos.find((todo) => todo._id == idUpdate);
    todo.title = todoTitle;
    updateTodo(todo);
  } else {
    createTodo(todoTitle);
  }
  todoInputEl.value = "";
});

async function deleteTodo(id) {
  await deleteTodoAPI(todos[id]._id);
  todos.splice(id, id + 1);
  renderUI(todos);
  changePage(1);
  renderPageButtons();
}

function updateTitle(id) {
  let title = todos[id].title;
  btnAdd.innerText = "CẬP NHẬT";
  todoInputEl.value = title;
  todoInputEl.focus();
  isUpdate = true;
  idUpdate = todos[id]._id;
}

async function updateTodo(todoUpdate) {
  let response = await updateTodoAPI(todoUpdate);

  todos.forEach((todo, index) => {
    if (todo._id == todoUpdate._id) {
      todos[index] = response.data.data.work;
    }
  });

  btnAdd.innerText = "Thêm";
  isUpdate = false;
  idUpdate = null;

  renderUI(todos);
  changePage(1);
  renderPageButtons();
}

//==================pagination==============//

function changePage(pageNumber) {
  currentPage = pageNumber;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = todos.slice(startIndex, endIndex);
  renderUI(currentTodos);
  renderPageButtons();
}

function renderPageButtons() {
  const pages = Math.ceil(todos.length / itemsPerPage);
  let pageButtons = "";
  for (let i = 1; i <= pages; i++) {
    pageButtons += `
      <button class="page-button" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }
  document.querySelector(".page-buttons").innerHTML = pageButtons;
}
// ========================================//
window.onload = () => {
  getTodos().then(() => {
    changePage(1);
    renderPageButtons();
  });
};
