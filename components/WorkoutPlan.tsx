'use client';

import React, { useState, useEffect } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { MdHelpOutline } from "react-icons/md";
import * as Progress from '@radix-ui/react-progress';


// Prop types for the workout plan. Adjust according to your actual data structure.
type Exercise = {
  name: string;
  sets: number;
  reps: number;
  image?: string; // Optional URL to an image for the exercise
}

type WorkoutPlanProps = {
  plan: {
    exercises: Exercise[];
  };
}

const WorkoutPlan = ({ plan }: WorkoutPlanProps) => {

  // Initialize progress state for each exercise
  const [exerciseProgress, setExerciseProgress] = useState(
    plan.exercises.map(() => 0) // Start with 0 progress for each exercise
  );

  // Use effect hook to set all the array exerciseprogress to zero when the component mounts
  useEffect(() => {
    setExerciseProgress(plan.exercises.map(() => 0));
  }, []);


  // Function to handle progress update
  const handleProgressUpdate = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress =>
      currentProgress.map((progress, index) =>
        index === exerciseIndex ? 
        Math.min(progress + 100 / plan.exercises[exerciseIndex].sets, 100) : // Ensure progress does not exceed 100
        progress
      )
    );
    console.log(exerciseProgress)
  };


  return (
    <div>
      <ul className="my-8">
        {plan.exercises.map((exercise, index) => (
          <Card className="my-2" key={index}>
            <CardHeader className="w-full flex-row items-center justify-between">
              {/* Image handling can be uncommented if images are to be displayed */}
              {/* {exercise.image && (
                <div className="max-w-48">
                  <img src={exercise.image} alt={exercise.name} />
                </div>
              )} */}
              <div className="flex-col justify-start">
                <CardTitle className="max-w-52">{exercise.name}</CardTitle>
                <CardDescription className="max-w-48">{exercise.sets} sets of {exercise.reps} reps</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <a href={constructEncodedLink(exercise.name)} target="_blank">
                  <MdHelpOutline className="h-4 w-4" />
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start justify-start">
                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                  // Key is now correctly placed on the outermost element
                  <div key={`set-${setIndex}`} className="flex items-center justify-between w-full my-2 "> 
                    <p>
                      Set nº{setIndex + 1}
                    </p>
                    <Button 
                      onClick={() => handleProgressUpdate(index)}
                      variant="secondary">
                      Completed 
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="min-h-8">
              <Progress.Root value={exerciseProgress[index]} max={100} className="relative overflow-hidden rounded-2xl w-60 h-8 border-solid border border-slate-200">
                <Progress.Indicator 
                  className=" bg-lime-300 w-full h-full transition-transform duration-[660ms] ease" 
                  style={{ transform: `translateX(-${100 - exerciseProgress[index]}%)` }}
                  />
              </Progress.Root>
            </CardFooter>
          </Card>
        ))}
      </ul>
    </div>
  );
};

function constructEncodedLink(workout_name : string): string {
  const encodedWorkoutName = encodeURIComponent(workout_name.toLowerCase());
  return `https://duckduckgo.com/?q=%5C${encodedWorkoutName}%20insite%20acefitness`;
}

export default WorkoutPlan;