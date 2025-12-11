import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { authService } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // RESETS FORM WHEN USER SWITCHES LOGIN ↔ SIGNUP
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (isLogin) {
        res = await authService.login(formData.email, formData.password);
        alert("Login Successful!");
      } else {
        res = await authService.register(formData);
        alert("Signup Successful!");
        setIsLogin(true);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      dispatch({ type: "SET_USER", payload: res.user });

      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');

      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (res.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Authentication Error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
        </button>
      </form>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          onClick={toggleForm}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
};

export default Login;
