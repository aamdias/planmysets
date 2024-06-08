'use client';

import React, { useState, useEffect } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { GrPowerReset } from "react-icons/gr";
import { BsCheckCircle } from "react-icons/bs";
import { FaShuffle } from "react-icons/fa6";
import { Badge } from './ui/badge';
import * as Progress from '@radix-ui/react-progress';
import { Skeleton } from './ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Prop types for the workout plan. Adjust according to your actual data structure.
type Exercise = {
  name: string;
  sets: number;
  reps: number;
  duration: number; // In minutes
}

type WorkoutPlanProps = {
  plan: {
    exercises: Exercise[];
  };
}

const WorkoutPlan = ({ plan }: WorkoutPlanProps) => {
  // Initialize state for exercises and progress
  const [exercises, setExercises] = useState(plan.exercises);
  const [exerciseProgress, setExerciseProgress] = useState(plan.exercises.map(() => 0)); // Start with 0 progress for each exercise
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);
  const [explanations, setExplanations] = useState<{ [key: number]: string }>({});

  // Use effect hook to set all the array exerciseprogress to zero when the component mounts
  useEffect(() => {
    setExerciseProgress(plan.exercises.map(() => 0));
  }, [plan.exercises]);

  // Function to handle progress update
  const handleProgressUpdate = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress =>
      currentProgress.map((progress, index) =>
        index === exerciseIndex ? 
        Math.min(progress + 100 / exercises[exerciseIndex].sets, 100) : // Ensure progress does not exceed 100
        progress
      )
    );
    console.log(exerciseProgress)
  };

  const handleProgressDecrease = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress => 
      currentProgress.map((progress,index)=>
        index === exerciseIndex ?
        Math.max(progress - 100 / exercises[exerciseIndex].sets,0) :
        progress
      )
    );
  }

  const handleExerciseShuffle = async (exerciseIndex: number) => {
    const exerciseName = exercises[exerciseIndex].name;
    const currentExerciseList = exercises.map(exercise => exercise.name);

    setLoadingIndexes(prev => [...prev, exerciseIndex]);
    try {
      const response = await fetch('/api/workoutShuffle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseName, currentExerciseList }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const suggestedExercise = JSON.parse(data.suggestedWorkout).suggestedExercise[0];

      // Update the exercise in the state
      setExercises(currentExercises =>
        currentExercises.map((exercise, index) =>
          index === exerciseIndex ? suggestedExercise : exercise
        )
      );

      // Reset the progress for this exercise
      setExerciseProgress(currentProgress =>
        currentProgress.map((progress, index) =>
          index === exerciseIndex ? 0 : progress
        )
      );

      // Clear the explanation for this exercise
      setExplanations(prev => {
        const newExplanations = { ...prev };
        delete newExplanations[exerciseIndex];
        return newExplanations;
      });

    } catch (error) {
      console.error('Failed to fetch exercise details:', error);
    } finally {
      setLoadingIndexes(prev => prev.filter(idx => idx !== exerciseIndex));
    }
  };

  const handleExerciseHelp = async (exerciseIndex: number) => {
    const exerciseName = exercises[exerciseIndex].name;

    if (explanations[exerciseIndex]) return; // Explanation already fetched

    try {
      const response = await fetch('/api/workoutHelp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setExplanations(prev => ({ ...prev, [exerciseIndex]: data.explanation }));
    } catch (error) {
      console.error('Failed to fetch exercise explanation:', error);
    }
  };

  // Calculate overall exercise progress
  const overallProgress = exerciseProgress.reduce((acc, cur) => acc + cur, 0) / exercises.length;

  const today = format(new Date(), 'MMMM dd, yyyy');

  return (
    <div>
      <div className="my-6">
        <h2 className="mb-2 text-md font-thin w-full text-center">YOUR WORKOUT PROGRESS</h2>
        {/* Container for the overall progress bar and value */}
        <div className="relative w-full h-8 border-solid border border-slate-200 rounded-2xl overflow-hidden">
          <Progress.Root value={overallProgress} max={100} className="absolute inset-0">
            <Progress.Indicator
              className="bg-lime-300 w-full h-full transition-transform duration-[660ms] ease"
              style={{ transform: `translateX(-${100 - overallProgress}%)` }}
            />
          </Progress.Root>
          {/* Absolute positioned progress text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {Math.round(overallProgress)}%
          </div>
        </div>
      </div>
      <ul className="my-4">
        {exercises.map((exercise, index) => (
          <Card className="my-2" key={index}>
            {loadingIndexes.includes(index) ? (
              <div className="p-4">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-8 w-full mt-4" />
              </div>
            ) : (
              <>
                <CardHeader className="w-full flex-row items-center justify-between">
                  <div className="flex-col justify-start">
                    <Badge variant="secondary" className="mb-2 ml-[-4px]">
                      {exercise.duration} minutes
                    </Badge>
                    <CardTitle className="max-w-52">{exercise.name}</CardTitle>
                    <CardDescription className="max-w-48 mt-2">
                      {exercise.sets > 1 && exercise.reps > 1 ? (
                        `${exercise.sets} sets of ${exercise.reps} reps`
                      ) : (
                        `Unique set`
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleExerciseShuffle(index)}>
                    <FaShuffle className="h-4 w-4" />
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
                        <div className="flex items-center space-x-2">
                          <Button 
                            onClick={() => handleProgressUpdate(index)}
                            variant="secondary"
                            size="icon"
                          >
                            <BsCheckCircle />
                          </Button>
                          <Button 
                            onClick={()=> handleProgressDecrease(index)}
                            variant="outline"
                            size="icon">
                            <GrPowerReset /> 
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="min-h-8 flex flex-col">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="w-60 text-sm text-slate-700 mb-6 mt-[-16px]">
                      <AccordionTrigger onClick={() => handleExerciseHelp(index)}>How to do it?</AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-500 border-none flex flex-col items-start">
                        {explanations[index] ? explanations[index] : 'Loading AI created tutorial...'}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {/* Container for the exercise progress bar and value */}
                  <div className="relative w-60 h-8 border-solid border border-slate-200 rounded-2xl overflow-hidden">
                    <Progress.Root value={exerciseProgress[index]} max={100} className="absolute inset-0">
                      <Progress.Indicator
                        className="bg-lime-300 w-full h-full transition-transform duration-[660ms] ease"
                        style={{ transform: `translateX(-${100 - exerciseProgress[index]}%)` }}
                      />
                    </Progress.Root>
                    {/* Absolute positioned progress text */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      {Math.round(exerciseProgress[index])}%
                    </div>
                  </div>
                  
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </ul>
      {overallProgress == 100 ? (
        <>
          <div className="text-center text-lg">
            Yeah! You did it! 🎉
          </div>
          <AlertDialog>
            <AlertDialogTrigger className="w-full align-center mt-4">
              <Button >Workout summary</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  <div className="space-y-2 bg-gray-100 p-4 rounded-md">
                    <div className="font-bold text-xl">
                      Gym Workout for {today}
                    </div>
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <BsCheckCircle className="w-4 h-4" />
                        <span className="font-medium">{exercise.name}</span>
                      </div>
                    ))}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Got it!</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="text-center text-lg">
          Keep going! 💪
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
