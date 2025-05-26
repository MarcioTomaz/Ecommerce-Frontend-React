import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(() => {
        return localStorage.getItem("userLogin") || null;
    });

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem("userRole") || null;
    });

    const login = (token, role) => {
        setUserToken(token);
        setUserRole(role);
        localStorage.setItem("userLogin", token);
        localStorage.setItem("userRole", role);
    };

    const logout = () => {
        setUserToken(null);
        setUserRole(null);
        localStorage.removeItem("userLogin");
        localStorage.removeItem("userRole");
    };

    return (
        <AuthContext.Provider value={{ userToken, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};