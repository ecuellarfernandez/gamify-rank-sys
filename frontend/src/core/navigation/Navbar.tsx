import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api";

interface UserInfo {
    id: string;
    name: string;
    email: string;
}

export function Navbar() {
    const { token, logout } = useAuth();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }
        apiFetch<UserInfo>("/user/me", {}, token)
            .then(setUser)
            .catch(() => setUser(null));
    }, [token]);

    return (
        <nav className="w-full flex items-center justify-between bg-gray-800 px-6 py-3 text-white shadow">
            <div className="font-bold text-lg">Gamify Rank System</div>
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <div className="flex flex-col items-end">
                            <span className="font-semibold">{user.name}</span>
                            <span className="text-xs text-gray-300">{user.email}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="ml-4 px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}