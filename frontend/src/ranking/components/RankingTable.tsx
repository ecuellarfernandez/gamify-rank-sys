import type { RankingEntry } from "../hooks/useRanking";
import { FaTrophy } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api";
import { useState } from "react";

const podium = [
    { position: 2, height: 32, color: "#C0C0C0" }, // Plata (izquierda)
    { position: 1, height: 48, color: "#FFD700" }, // Oro (centro)
    { position: 3, height: 24, color: "#CD7F32" }, // Bronce (derecha)
];

export function RankingTable({ ranking }: { ranking: RankingEntry[] }) {
    const { user, token } = useAuth();
    const [message, setMessage] = useState<string | null>(null);

    // Ordena para que el podio sea [2,1,3]
    const podiumRanking = [ranking[1], ranking[0], ranking[2]];

    // Últimos 5 del ranking (excluyendo los 3 primeros)
    const lastFive = ranking.slice(-3);

    const handleCreateSeason = async () => {
        const now = new Date();
        const start_date = now.toISOString().slice(0, 10);
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        const end_date = end.toISOString().slice(0, 10);

        try {
            await apiFetch("/season", {
                method: "POST",
                body: JSON.stringify({
                    name: `Temporada ${start_date} - ${end_date}`,
                    start_date,
                    end_date,
                }),
                headers: { "Content-Type": "application/json" },
            }, token!);
            setMessage("¡Nueva temporada creada!");
            setTimeout(() => setMessage(null), 2000);
        } catch {
            setMessage("Error al crear la temporada");
            setTimeout(() => setMessage(null), 2000);
        }
    };

    return (
        <>
            <div className="flex justify-center items-end h-96 gap-6">
                {podium.map((p, idx) => {
                    const entry = podiumRanking[idx];
                    if (!entry) return (
                        <div key={p.position} className="flex flex-col items-center w-32 mx-2" />
                    );
                    return (
                        <div
                            key={entry.user.id}
                            className="flex flex-col items-center w-32"
                        >
                            <div className="mb-2">
                                <FaTrophy style={{ color: p.color, fontSize: p.height }} />
                            </div>
                            <div
                                className="flex flex-col items-center justify-end w-full text-white"
                                style={{
                                    height: `${100 + p.height}px`,
                                    background: "rgb(44 44 44)",
                                }}
                            >
                                <div className="text-5xl font-bold">
                                    {p.position}
                                </div>
                                <div className="text-center px-2 py-2">
                                    <div className="font-semibold">{entry.user.name}</div>
                                    <div className="text-sm">{entry.total_points} puntos</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Botón para crear temporada si es admin */}
            {user?.role?.name === "admin" && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCreateSeason}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Crear nueva temporada (1 mes)
                    </button>
                </div>
            )}
            {message && (
                <div className="text-center mt-2 text-green-600">{message}</div>
            )}
            {/* Tabla de los últimos 5 del ranking */}
            <div className="mt-10 max-w-xl mx-auto">
                <h2 className="text-lg font-bold mb-2 text-center">Últimos 5 del ranking</h2>
                <table className="w-full bg-white rounded shadow">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 text-left">Posición</th>
                            <th className="py-2 px-4 text-left">Nombre</th>
                            <th className="py-2 px-4 text-left">Puntos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastFive.map((entry) => (
                            <tr key={entry.user.id} className="border-t">
                                <td className="py-2 px-4">{entry.position}</td>
                                <td className="py-2 px-4">{entry.user.name}</td>
                                <td className="py-2 px-4">{entry.total_points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}