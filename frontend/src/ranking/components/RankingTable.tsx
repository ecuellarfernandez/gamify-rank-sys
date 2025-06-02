import type { RankingEntry } from "../hooks/useRanking";
import { FaTrophy } from "react-icons/fa";

const podium = [
    { position: 2, height: 32, color: "#C0C0C0" }, // Plata (izquierda)
    { position: 1, height: 48, color: "#FFD700" }, // Oro (centro)
    { position: 3, height: 24, color: "#CD7F32" }, // Bronce (derecha)
];

export function RankingTable({ ranking }: { ranking: RankingEntry[] }) {
    // Ordena para que el podio sea [2,1,3]
    const podiumRanking = [ranking[1], ranking[0], ranking[2]];

    return (
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
    );
}