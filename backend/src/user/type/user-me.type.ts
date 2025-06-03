export type UserMeType = {
    id: string;
    name: string;
    email: string;
    role: {
        id: string;
        name: string;
    };
    total_points: number;
};
