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

    // Selecciona la última temporada (más reciente) por defecto
    useEffect(() => {
        if (!loadingSeasons && seasons.length > 0 && !selectedSeason) {
            // Ordena por start_date descendente y toma la primera
            const sortedSeasons = [...seasons].sort(
                (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
            );
            setSelectedSeason(sortedSeasons[0].id);
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
                    <select
                        onChange={e => setSelectedSeason(e.target.value)}
                        value={selectedSeason ?? ""}
                        disabled={loadingSeasons}
                    >
                        <option value="" disabled>Selecciona una temporada</option>
                        {[...seasons]
                            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                            .map(season => (
                                <option key={season.id} value={season.id}>
                                    {season.name} ({season.start_date} - {season.end_date})
                                </option>
                            ))}
                    </select>
                )}

                {selectedSeason && !loadingRanking && <RankingTable ranking={ranking} />}
                {selectedSeason && loadingRanking && <p>Cargando ranking...</p>}
            </div>
        </Layout>
    );
}