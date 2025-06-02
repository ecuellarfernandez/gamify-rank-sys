import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export interface RankingEntry {
    position: number;
    user: { id: string; name: string; email: string };
    total_points: number;
    season: { id: string; name: string };
}

export function useRanking(seasonId: string, token: string) {
    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch<RankingEntry[]>(`/ranking/season/${seasonId}`, {}, token)
            .then(setRanking)
            .finally(() => setLoading(false));
    }, [seasonId, token]);

    return { ranking, loading };
}