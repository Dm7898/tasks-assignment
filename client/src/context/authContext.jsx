import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) setUser(JSON.parse(user));
  }, []);

  const login = (data) => {
    // console.log(data);
    localStorage.setItem("userData", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
