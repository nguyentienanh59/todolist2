const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const todosApi = "http://localhost:3000/todos";
let isUpdate = false;
let idUpdate = null;
let todos = [];
let thisPage = 1;
let limit = 6;
let list = document.querySelectorAll(".todo-list .todo-item");

function getTodoAPI(status) {
  switch (status) {
    case "all": {
      return axios.get(`${todosApi}`);
    }
    case "active": {
      return axios.get(`${todosApi}?status=true`);
    }
    case "unactive": {
      return axios.get(`${todosApi}?status=false`);
    }
    default: {
      return axios.get(`${todosApi}`);
    }
  }
}
function createTodoApi(title) {
  return axios.post(`${todosApi}`, {
    id: createId(),
    title: title,
    status: false,
  });
}
function deleteTodoApi(id) {
  return axios.delete(`${todosApi}/${id}`);
}

function updateTodoApi(todo) {
  return axios.put(`${todosApi}/${todo.id}`, {
    title: todo.title,
    status: todo.status,
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
                    <button class="btn btn-update" onclick="updateTitle(${
                      t.id
                    })">
                        <img src="./img/pencil.svg" alt="icon" />
                    </button>
                    <button class="btn btn-delete" onclick=deleteTodo(${t.id})>
                        <img src="./img/remove.svg" alt="icon" />
                    </button>
                </div>
            </div>
        `;
  }
}
async function getTodos(status) {
  const response = await getTodoAPI(status);
  todos = response.data;
  renderUI(todos);
  console.log(todos);
}

function createId() {
  return Math.floor(Math.random() * 1000);
}

async function createTodo(title) {
  const response = await createTodoApi(title);
  todos.push(response.data);
  renderUI(todos);
}

btnAdd.addEventListener("click", () => {
  let todoTitle = todoInputEl.value;
  if (todoTitle == "") {
    alert("Không được để trống");
    return;
  }
  if (isUpdate) {
    let todo = todos.find((todo) => todo.id == idUpdate);
    todo.title = todoTitle;

    updateTodo(todo);
  } else {
    createTodo(todoTitle);
  }
  todoInputEl.value = "";
});

async function deleteTodo(id) {
  await deleteTodoApi(id);

  todos.filter((todo) => todo.id == id).splice(1);
  renderUI(todos);
}

async function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id == id);
  todo.status = !todo.status;

  let res = await updateTodoApi(todo);

  todos.forEach((todo, index) => {
    if (todo.id == id) {
      todos[index] = res.data;
    }
  });
  renderUI(todos);
}
function getOptionSelected() {
  for (let i = 0; i < todoOptionEls.length; i++) {
    if (todoOptionEls[i].checked) {
      return todoOptionEls[i].value;
    }
  }
}

todoOptionEls.forEach((btn) => {
  btn.addEventListener("change", function () {
    let optionSelected = getOptionSelected();
    getTodos(optionSelected);
  });
});

function updateTitle(id) {
  let title;
  todos.forEach((todo) => {
    if (todo.id == id) {
      title = todo.title;
    }
  });

  btnAdd.innerText = "CẬP NHẬT";

  todoInputEl.value = title;
  todoInputEl.focus();

  idUpdate = id;
  isUpdate = true;
}

async function updateTodo(todoUpdate) {
  let response = await updateTodoApi(todoUpdate);

  todos.forEach((todo, index) => {
    if (todo.id == todoUpdate.id) {
      todos[index] = response.data;
    }
  });

  btnAdd.innerText = "Thêm";
  isUpdate = false;
  idUpdate = null;

  renderUI(todos);
}

window.onload = () => {
  getTodos();
};
//==================pagination==============//

function loadItem() {
  let beginGet = limit * (thisPage - 1);
  let endGet = limit * thisPage - 1;
  list.forEach((item, key) => {
    if (key >= beginGet && key <= endGet) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}
loadItem();

