import axios from "axios";

// BASE URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ===========================================
// REQUEST INTERCEPTOR
// ===========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===========================================
// RESPONSE INTERCEPTOR
// ===========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===========================================
// AUTH SERVICE
// ===========================================
export const authService = {
  // SIGNUP
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  // LOGIN
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  // CURRENT USER
  getCurrentUser: async () => {
    const res = await api.get("/auth/me");
    return res.data.user;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ===========================================
// INFLUENCER SERVICE
// ===========================================
export const influencerService = {
  getAll: async () => (await api.get("/influencers")).data,
  getById: async (id) => (await api.get(`/influencers/${id}`)).data,
  create: async (data) => (await api.post("/influencers", data)).data,
  update: async (id, data) => (await api.put(`/influencers/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/influencers/${id}`)).data,
};

// ===========================================
// EVENTS SERVICE
// ===========================================
export const eventService = {
  getAll: async () => (await api.get("/events")).data,
  getById: async (id) => (await api.get(`/events/${id}`)).data,
  getCategories: async () => (await api.get("/events/categories")).data,
  create: async (data) => (await api.post("/events", data)).data,
  update: async (id, data) => (await api.put(`/events/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/events/${id}`)).data,
};

// ===========================================
// PACKAGES SERVICE
// ===========================================
export const packageService = {
  getAll: async () => (await api.get("/packages")).data,
  getById: async (id) => (await api.get(`/packages/${id}`)).data,
  create: async (data) => (await api.post("/packages", data)).data,
  update: async (id, data) => (await api.put(`/packages/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/packages/${id}`)).data,
};

// ===========================================
// BOOKINGS SERVICE
// ===========================================
export const bookingService = {
  create: async (data) => (await api.post("/bookings", data)).data,
  getAll: async () => (await api.get("/bookings")).data,
  getById: async (id) => (await api.get(`/bookings/${id}`)).data,
  updateStatus: async (id, status) =>
    (await api.put(`/bookings/${id}/status`, { status })).data,
  delete: async (id) => (await api.delete(`/bookings/${id}`)).data,
};

// ===========================================
// QUERIES SERVICE
// ===========================================
export const queryService = {
  create: async (data) => (await api.post("/queries", data)).data,
  getAll: async () => (await api.get("/queries")).data,
  getById: async (id) => (await api.get(`/queries/${id}`)).data,
  updateStatus: async (id, status) =>
    (await api.put(`/queries/${id}/status`, { status })).data,
  delete: async (id) => (await api.delete(`/queries/${id}`)).data,
};

export default api;
