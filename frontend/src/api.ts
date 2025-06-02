const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}