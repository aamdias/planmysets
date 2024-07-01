// pages/home/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';
import WorkoutCreationForm from '@/components/WorkoutCreationForm';
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaArrowRight } from "react-icons/fa";
import { FiTrash2 } from 'react-icons/fi';

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  duration: number;
  muscleGroup: string;
};

type Workout = {
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
  workout_focus: string; // New field
  workout_location: string; // New field
};

const HomePage = () => {
  const { session } = useSession();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchWorkouts();
    }
  }, [session]);

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session?.user.id);

    if (error) {
      console.error(error);
    } else {
      setWorkouts(data);
    }
    setLoading(false);
  };

  const handleFormSubmit = async (values: { workout_focus: string; workout_location: string; workout_duration: number }) => {
    const newWorkout = {
      workoutType: values.workout_focus,
      workoutDuration: values.workout_duration.toString(),
      chosenItems: values.workout_location === 'home_gym' ? defaultItems : fullGymItems,
      userId: session?.user.id,
    };

    const response = await fetch('/api/workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newWorkout),
    });

    if (response.ok) {
      fetchWorkouts(); // Refresh the workouts list
    } else {
      console.error('Error creating workout:', await response.json());
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);

    if (error) {
      console.error(error);
    } else {
      fetchWorkouts(); // Refresh the workouts list
    }
  };

  if (!session) return <p>Please log in</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full bg-white flex flex-col items-start px-2">
      <main className="w-full py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Treinos</h1>
          {workouts.length > 0 && (
            <Button>
            <WorkoutCreationForm onSubmit={handleFormSubmit} />
            </Button>
          )}
        </div>
        {workouts.length === 0 ? (
          <div className="no-workouts bg-gradient-to-b from-[#FCFBFB] to-[#EBEBEB] shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Começe agora</h2>
            <p className="text-gray-700 mb-4">
              Crie seu primeiro treino. Você poderá criar usando IA, onde receberá recomendações de exercícios para academia gerados por IA. Lembre-se de se exercitar com segurança e consultar um profissional.
            </p>
            <WorkoutCreationForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="workouts-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div key={workout.id} className="workout-card bg-white drop-shadow-lg rounded-lg p-4">
                <div className="workout-info">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500">{format(new Date(workout.workout_date), 'dd MMM yyyy')}</span>
                    <Badge variant="outline">{workout.workout_status}</Badge>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Treino <span className="text-[#EB5864]">{workout.workout_focus}</span></h2>
                  <div className="exercise-tags mt-2 flex flex-wrap gap-2">
                    {workout.workout_exercises.map((exercise) => (
                    <Badge key={exercise.name} variant="secondary">{exercise.name}</Badge>
                    ))}
                  </div>
                </div>
                <div className="workout-actions mt-4 flex justify-between items-center">
                  <Link href={`/workout/${workout.id}`}>
                    <Button>
                        Acessar
                        <FaArrowRight className="ml-2"/>
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => handleDeleteWorkout(workout.id)}>
                    <FiTrash2 className="h-5 w-5 text-slate-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
