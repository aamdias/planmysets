'use client';

import React, { useState } from 'react';
import CreateWorkoutButton from '@/components/CreateWorkoutButton';
import WorkoutPlan from '@/components/WorkoutPlan';
import { ButtonLoading } from '@/components/ButtonLoading';

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000';

export default function HomePage() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWorkoutPlan = async () => {
    setLoading(true); // Set loading to true before the API call
    try {
      console.log('Fetching workout plan...');
      const response = await fetch(`${domain}/api/workout`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWorkoutPlan(data.formatJSON?.exercises);
    } catch (error) {
      console.error('Failed to fetch workout plan:', error);
    } finally {
      setLoading(false); // Reset loading state regardless of outcome
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-fit p-4 w-full">
      {/* Adjusted div to be more responsive with w-full */}
      <div className="flex flex-col justify-center items-center w-full max-w-4xl px-4 py-8 bg-white rounded shadow my-8">
        {/* Wrapped content in a new div for better control over its size and background */}
        {workoutPlan ? (
          <div>
            <h1 className="text-4xl font-bold md:text-5xl lg:text-5xl mb-4 text-center">
            {/* Responsive font size */}
              Let&apos;s do it.
            </h1>
            <p className="max-w-[700px] text-center text-gray-500 md:text-xl/relaxed dark:text-gray-400 mb-4">
              Below there is s a suggestion of a set of gym exercises. Always ask for help for a physical educator to make sure you are doing it properly! If you prefer, click again to create a new workout.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold md:text-5xl lg:text-5xl mb-4 text-center">
              {/* Responsive font size */}
              Ready to start training?
            </h1>
            <p className="max-w-[700px] text-center text-gray-500 md:text-xl/relaxed dark:text-gray-400 mb-4">
            Jumpstart your gym routine by clicking below. You'll receive AI-generated exercise recommendations. Remember to exercise safely and consult a professional if necessary.
            </p>
          </div>
        )}
        {loading ? (
          <ButtonLoading />
        ) : (
          <CreateWorkoutButton onClick={fetchWorkoutPlan} />
        )}
        {workoutPlan && (
          <WorkoutPlan plan={{ exercises: workoutPlan }} />
        )}
      </div>
    </div>
  );
}
