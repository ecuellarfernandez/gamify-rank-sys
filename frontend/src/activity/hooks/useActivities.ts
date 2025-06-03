import { useEffect, useState } from "react";
import { apiFetch } from "../../api";

export interface Activity {
    id: string;
    type: string;
    description: string;
    points: number;
}

export function useActivities(token: string) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        apiFetch<Activity[]>("/activity", {}, token)
            .then(setActivities)
            .finally(() => setLoading(false));
    }, [token]);

    return { activities, loading };
}