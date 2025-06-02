import type { RankingEntry } from "../hooks/useRanking";
import { FaMedal } from "react-icons/fa";

const getMedal = (position: number) => {
    if (position === 1) return <FaMedal style={{ color: "#FFD700", fontSize: 28 }} title="Oro" />;
    if (position === 2) return <FaMedal style={{ color: "#C0C0C0", fontSize: 28 }} title="Plata" />;
    if (position === 3) return <FaMedal style={{ color: "#CD7F32", fontSize: 28 }} title="Bronce" />;
    return position;
};

export function RankingTable({ ranking }: { ranking: RankingEntry[] }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Posición</th>
                    <th>Nombre</th>
                    <th>Puntos</th>
                </tr>
            </thead>
            <tbody>
                {ranking.map((entry) => (
                    <tr key={entry.user.id}>
                        <td>{getMedal(entry.position)}</td>
                        <td>{entry.user.name}</td>
                        <td>{entry.total_points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}