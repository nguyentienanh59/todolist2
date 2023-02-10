const todoListEl = document.querySelector(".todo-list");
const todoOptionEls = document.querySelectorAll(".todo-option-item input");
const todoInputEl = document.getElementById("todo-input");
const btnAdd = document.getElementById("btn-add");
const todosApi = "https://api-training-xr6q.onrender.com/api/v1";
let isUpdate = false;
let idUpdate = null;
let todos = [];

const instance = axios.create({
  baseURL: "https://api-training-xr6q.onrender.com/api/v1/",
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
    localStorage.setItem("token", accessToken);

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getTodoAPI = async () => {
  try {
    const response = await instance.get(`${todosApi}/work`);
    console.log(response);
    // return response.data;
  } catch (error) {
    throw error;
  }
};
// console.log(getTodoList())

// function createTodoApi(id, title) {
//   return axios.post(`${todosApi}/work`, {
//     id: id,
//     title: title,
//     status: false,
//   });
// }
// function deleteTodoApi(id) {
//   return axios.delete(`${todosApi}/work/${id}`);
// }

// function updateTodoApi(todo) {
//   return axios.put(`${todosApi}/work/${todo.id}`, {
//     title: todo.title,
//     status: todo.status,
//   });
// }

// function renderUI(arr) {
//   todoListEl.innerHTML = "";

//   // Kiểm tra mảng rỗng
//   if (arr.length == 0) {
//     todoListEl.innerHTML = "Không có công việc nào trong danh sách";
//     return;
//   }

//   // Trường hợp có công việc
//   for (let i = 0; i < arr.length; i++) {
//     const t = arr[i];
//     todoListEl.innerHTML += `
//             <div class="todo-item ${t.status ? "active-todo" : ""}">
//                 <div class="todo-item-title">
//                     <input
//                         type="checkbox"
//                         ${t.status ? "checked" : ""}
//                         onclick="toggleStatus(${t.id})"
//                     />
//                     <p>${t.title}</p>
//                 </div>
//                 <div class="option">
//                     <button class="btn btn-update" onclick="updateTitle(${
//                       t.id
//                     })">
//                         <img src="./img/pencil.svg" alt="icon" />
//                     </button>
//                     <button class="btn btn-delete" onclick=deleteTodo(${t.id})>
//                         <img src="./img/remove.svg" alt="icon" />
//                     </button>
//                 </div>
//             </div>
//         `;
//   }
// }
async function getTodos() {
  const response = await getTodoAPI();
  todos = response.data;
  console.log(todos)
  // renderUI(todos);
}

// function createId() {
//   return Math.floor(Math.random() * 1000);
// }

// async function createTodo(title) {
//   const response = await createTodoApi(title);
//   todos.push(response.data);
//   renderUI(todos);
// }

// btnAdd.addEventListener("click", () => {
//   let todoTitle = todoInputEl.value;
//   if (todoTitle == "") {
//     alert("Không được để trống");
//     return;
//   }
//   if (isUpdate) {
//     let todo = todos.find((todo) => todo.id == idUpdate);
//     todo.title = todoTitle;

//     updateTodo(todo);
//   } else {
//     createTodo(todoTitle);
//   }
//   todoInputEl.value = "";
// });

// async function deleteTodo(id) {
//   await deleteTodoApi(id);

//   todos.filter((todo) => todo.id == id).splice(1);
//   renderUI(todos);
// }

// async function toggleStatus(id) {
//   let todo = todos.find((todo) => todo.id == id);
//   todo.status = !todo.status;

//   let res = await updateTodoApi(todo);

//   todos.forEach((todo, index) => {
//     if (todo.id == id) {
//       todos[index] = res.data;
//     }
//   });
//   renderUI(todos);
// }
// function getOptionSelected() {
//   for (let i = 0; i < todoOptionEls.length; i++) {
//     if (todoOptionEls[i].checked) {
//       return todoOptionEls[i].value;
//     }
//   }
// }

// todoOptionEls.forEach((btn) => {
//   btn.addEventListener("change", function () {
//     let optionSelected = getOptionSelected();
//     getTodos(optionSelected);
//   });
// });

// function updateTitle(id) {
//   let title;
//   todos.forEach((todo) => {
//     if (todo.id == id) {
//       title = todo.title;
//     }
//   });

//   btnAdd.innerText = "CẬP NHẬT";

//   todoInputEl.value = title;
//   todoInputEl.focus();

//   idUpdate = id;
//   isUpdate = true;
// }

// async function updateTodo(todoUpdate) {
//   let response = await updateTodoApi(todoUpdate);

//   todos.forEach((todo, index) => {
//     if (todo.id == todoUpdate.id) {
//       todos[index] = response.data;
//     }
//   });

//   btnAdd.innerText = "Thêm";
//   isUpdate = false;
//   idUpdate = null;

//   renderUI(todos);
// }

window.onload = () => {
  getTodos();
};
//==================pagination==============//
