import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSeasons } from "../../seasons/hooks/useSeason";
import { useRanking } from "../hooks/useRanking";
import { RankingTable } from "../components/RankingTable";
import { Layout } from "../../core/layout/Layout";

export default function RankingPage() {
    const { token } = useAuth();
    const { seasons, loading: loadingSeasons } = useSeasons(token!);
    const [selectedSeason, setSelectedSeason] = useState<string | null>(null);

    useEffect(() => {
        if (!loadingSeasons && seasons.length > 0 && !selectedSeason) {
            setSelectedSeason(seasons[0].id);
        }
    }, [loadingSeasons, seasons, selectedSeason]);

    const { ranking, loading: loadingRanking } = useRanking(selectedSeason ?? "", token!);

    return (
        <Layout>
            <div>
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
        </Layout>
    );
}