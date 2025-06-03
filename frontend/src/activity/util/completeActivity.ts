import { apiFetch } from "../../api";

export async function completeActivity(activityId: string, token: string) {
    return apiFetch("/user-activity", {
        method: "POST",
        body: JSON.stringify({ activityId }),
    }, token);
}