// app/workout/[workoutId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WorkoutPlan from '@/components/WorkoutPlan';
import supabase from '@/lib/supabaseClient';
import { Workout } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const WorkoutPage = ({ params }: { params: { workoutId: string } }) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', params.workoutId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setWorkout(data);
      }
      setLoading(false);
    };

    fetchWorkout();
  }, [params.workoutId]);

if (loading) return <p>Loading...</p>;
if (!workout) return <p>No workout found</p>;

// Format workout date to a humam redable date like dd Month Year without the hours
const date = new Date(workout.workout_date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

// Format workout focus from snake case to title case
const workoutFocus = workout.workout_focus
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

return (
    <div className="container mx-auto py-12 px-4">
        <h2 className="text-xl font-light mb-2 text-center text-slate-500">{date}</h2>
        <h1 className="text-4xl font-bold mb-4 text-center">Treino de <span className="text-[#EB5864]">{workoutFocus}</span></h1>
        <h2 className="text-lg font-light mb-2 text-center text-slate-400">Na dúvida, sempre consulte um profissional</h2>
        <WorkoutPlan 
            plan={{ exercises: workout.workout_exercises }}
            workoutFocus={workout.workout_focus}
            workoutId={workout.id}
        />
        <div className="flex justify-center mt-8">
            <Button asChild variant="secondary">
                <Link href="/home" className="flex items-center gap-2">
                    Voltar para o início
                </Link>
            </Button>
        </div>
    </div>
);
};

export default WorkoutPage;
