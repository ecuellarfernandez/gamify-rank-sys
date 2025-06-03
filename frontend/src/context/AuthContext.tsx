import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiFetch } from "../api";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    total_points?: number;
    role?: {
        name:string;
    }
}

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    user: UserInfo | null;
    fetchUser: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [user, setUser] = useState<UserInfo | null>(null);

    const fetchUser = async (token: string) => {
        try {
            const data = await apiFetch<UserInfo>("/user/me", {}, token);
            setUser(data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            fetchUser(token);
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
        // eslint-disable-next-line
    }, [token]);

    const login = (newToken: string) => setToken(newToken);
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, logout, user, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}