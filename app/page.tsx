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
    <div className="flex flex-col justify-center items-center min-h-screen p-4 w-full">
      {/* Adjusted div to be more responsive with w-full */}
      <div className="flex flex-col justify-center items-center w-full max-w-4xl p-4 bg-white rounded shadow">
        {/* Wrapped content in a new div for better control over its size and background */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4 text-center">
          {/* Responsive font size */}
          Ready to start training?
        </h1>
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
