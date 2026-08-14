import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(); // Create a context

/**
 * 
 * @param {JSX.Element} children - The children of the component
 * @returns {JSX.Element} - The AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  };

  // Register function
  const register = async (name, email, password) => {
    await axios.post("/api/auth/register", { name, email, password });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
