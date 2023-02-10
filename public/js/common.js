const instance = axios.create({
  baseURL: "https://api-training-xr6q.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
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
    sessionStorage.setItem("token", accessToken);

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

