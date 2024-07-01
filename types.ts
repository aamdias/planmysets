export type Exercise = {
    name: string;
    sets: number;
    reps: number;
    duration: number;
    muscleGroup: string;
  }
  
  export type Workout = {
    id: string;
    user_id: string;
    workout_name: string;
    workout_date: string;
    workout_status: string;
    workout_exercises: Exercise[];
    workout_progress: number;
    workout_exercises_progress: any; // Adjust this type as needed
    workout_rating: number;
    workout_duration: number;
    workout_focus: string;
    workout_location: string;
  }