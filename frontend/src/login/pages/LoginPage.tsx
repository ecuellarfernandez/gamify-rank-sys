import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Layout } from "../../core/layout/Layout";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await apiFetch<{ access_token: string }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            login(res.access_token);
            navigate("/");
        } catch {
            setError("Login failed");
        }
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input
                    className="w-full mb-4 px-3 py-2 border rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    className="w-full mb-4 px-3 py-2 border rounded"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </form>
        </Layout>
    );
}