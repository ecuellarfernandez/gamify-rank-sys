import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export interface Season {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
}

export function useSeasons(token: string) {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch<Season[]>("/season", {}, token)
            .then(setSeasons)
            .finally(() => setLoading(false));
    }, [token]);

    return { seasons, loading };
}