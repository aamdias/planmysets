'use client';

import React, { useState } from 'react';
import CreateWorkoutButton from '@/components/CreateWorkoutButton';
import WorkoutPlan from '@/components/WorkoutPlan';

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000';

export default function HomePage() {
  const [workoutPlan, setWorkoutPlan] = useState(null);

  // This function is triggered by the button click now
  const fetchWorkoutPlan = async () => {
    try {
      console.log('Fetching workout plan...');
      const response = await fetch(`${domain}/api/workout`); // Adjust for production
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWorkoutPlan(data.formatJSON?.exercises); // Assuming the API response structure
    } catch (error) {
      console.error('Failed to fetch workout plan:', error);
      // Handle error state if needed
    }
  };

  return (
    <div className="flex flex-col m-16 justify-center items-center min-h-screen p-4">
      <h1 className="flex mb-4 text-2xl">Ready to start training?</h1>
      {/* Pass fetchWorkoutPlan to be called onClick */}
      <CreateWorkoutButton onClick={fetchWorkoutPlan} />
      {/* Render WorkoutPlan directly with the fetched data */}
      {workoutPlan && (
        <WorkoutPlan plan={{ exercises: workoutPlan }} />
      )}
    </div>
  );
}