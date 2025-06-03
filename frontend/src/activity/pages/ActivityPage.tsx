import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../../api";
import { Layout } from "../../core/layout/Layout";

interface Activity {
    id: string;
    type: string;
    description: string;
    points: number;
    completed: boolean;
}

export default function ActivityPage() {
    const { token, fetchUser } = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        apiFetch<Activity[]>("/activity", {}, token!)
            .then(setActivities)
            .finally(() => setLoading(false));
    }, [token]);

    const handleComplete = async (activityId: string) => {
        try {
            await apiFetch(`/user-activity`, {
                method: "POST",
                body: JSON.stringify({ activityId }),
            }, token!);
            setMessage("¡Actividad completada!");
            // Actualiza la lista de actividades después de completar
            setActivities((prev) =>
                prev.map((a) =>
                    a.id === activityId ? { ...a, completed: true } : a
                )
            );
            // Refresca los puntos del usuario en el navbar
            await fetchUser(token!);
            setTimeout(() => setMessage(""), 2000);
        } catch {
            setMessage("Error al completar la actividad");
            setTimeout(() => setMessage(""), 2000);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Actividades Disponibles</h1>
            {message && <div className="mb-4 text-center text-green-600">{message}</div>}
            {loading ? (
                <p>Cargando actividades...</p>
            ) : (
                <div className="grid gap-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`rounded shadow p-4 flex justify-between items-center transition
                                ${activity.completed
                                    ? "bg-gray-700 text-gray-300 opacity-60"
                                    : "bg-white"
                                }`}
                        >
                            <div>
                                <div className="font-semibold">{activity.type}</div>
                                <div>{activity.description}</div>
                                <div className="text-blue-600 font-bold">{activity.points} puntos</div>
                            </div>
                            <button
                                className={`px-4 py-2 rounded ${
                                    activity.completed
                                        ? "bg-gray-500 text-white cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                                onClick={() => handleComplete(activity.id)}
                                disabled={activity.completed}
                            >
                                {activity.completed ? "Completada" : "Completar"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}