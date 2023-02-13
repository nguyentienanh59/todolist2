const form = document.querySelector("form"),
  formLg = document.querySelector(".login form"),
  username = document.querySelector("#username"),
  usernameLg = document.querySelector("#usernameLogin"),
  password = document.querySelector("#password"),
  passwordLg = document.querySelector("#passwordLogin"),
  confirmPassword = document.querySelector("#cpassword"),
  wrapper = document.querySelector(".wrapper"),
  signupHeader = document.querySelector(".signup header"),
  loginHeader = document.querySelector(".login header");

// ==================form================//
loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
// ===================Toast================//

const showToast = () => {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1000);
};
const showToastFail = () => {
  const toast = document.getElementById("toast-fail");
  toast.classList.remove("hidden-fail");
  setTimeout(() => {
    toast.classList.add("hidden-fail");
  }, 1000);
};
// =================Validate=======================//
function showError(input, message) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.add("error");
  small.innerText = message;
}

function showSuccess(input) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.remove("error");
  small.innerText = "";
}

function checkEmptyError(listInput) {
  let isEmptyError = false;
  listInput.forEach((input) => {
    input.value = input.value.trim();
    if (!input.value) {
      isEmptyError = true;
      return showError(input, "Không được để trống");
    } else {
      return showSuccess(input);
    }
  });
  return isEmptyError;
}

function checkPassword(passwordInput, cfPasswordInput) {
  if (passwordInput.value !== cfPasswordInput.value) {
    showError(cfPasswordInput, "Mật khẩu không trùng khớp");
    return true;
  }
  return false;
}
// ==============================================//
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
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================Signup===================//
const signUp = async (username, password, passwordConfirmation) => {
  try {
    const response = await instance.post("/user/signup", {
      username: username.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    });
    if (response.status === 200 || response.status === 201) {
      localStorage.setItem("token", response.data.token);
      showToast();
      // loginHeader.click();
      setTimeout((window.location.href = "./main.html"), 5000);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isEmptyError = checkEmptyError([username, password, confirmPassword]);
  let isErrorPassword = checkPassword(password, confirmPassword);

  if (isEmptyError || isErrorPassword) {
    alert("Nhập lại");
  } else {
    signUp(username, password, confirmPassword);
  }
  username.value = "";
  password.value = "";
  confirmPassword.value = "";
});

// ===================Login=======================//
const login = async (username, password) => {
  try {
    const response = await instance.post("/user/login", {
      username: username.value,
      password: password.value,
    });
    if (response.status === 200 || response.status === 201) {
      localStorage.setItem("token", response.data.token);
      showToast();
      setTimeout((window.location.href = "./main.html"), 5000);
    } else {
      showToastFail();
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
formLg.addEventListener("submit", function (e) {
  e.preventDefault();
  let isEmptyErrorLg = checkEmptyError([usernameLg]);
  if (isEmptyErrorLg) {
    alert("Đăng nhập lỗi");
  } else {
    login(usernameLg, passwordLg);
  }
});

