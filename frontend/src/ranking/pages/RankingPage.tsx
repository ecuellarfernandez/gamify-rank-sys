import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSeasons } from "../../seasons/hooks/useSeason";
import { useRanking } from "../hooks/useRanking";
import { RankingTable } from "../components/RankingTable";

export default function RankingPage() {
    const { token, logout } = useAuth();
    const { seasons, loading: loadingSeasons } = useSeasons(token!);
    const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
    const { ranking, loading: loadingRanking } = useRanking(selectedSeason ?? "", token!);

    return (
        <div>
            <button onClick={logout} style={{ float: "right" }}>Logout</button>
            <h1>Ranking por Temporada</h1>
            {loadingSeasons ? (
                <p>Cargando temporadas...</p>
            ) : (
                <select onChange={e => setSelectedSeason(e.target.value)} value={selectedSeason ?? ""}>
                    <option value="" disabled>Selecciona una temporada</option>
                    {seasons.map(season => (
                        <option key={season.id} value={season.id}>
                            {season.name} ({season.start_date} - {season.end_date})
                        </option>
                    ))}
                </select>
            )}

            {selectedSeason && (
                loadingRanking ? <p>Cargando ranking...</p> : <RankingTable ranking={ranking} />
            )}
        </div>
    );
}