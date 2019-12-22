export interface Exercise {
    id: string;
    name: string;
    duration: number;
    caloriesBurnt: number;
    date?: Date;
    state?: 'completed' | 'cancelled' | null;
}
