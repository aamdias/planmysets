'use client';

import React, { useState, useEffect } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { MdHelpOutline } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";
import { BsCheckCircle } from "react-icons/bs";
import { Badge } from './ui/badge';
import * as Progress from '@radix-ui/react-progress';
import ExerciseHelperDialog from './ExerciseHelperDialog';
import ExerciseShuffleDialog from './ExerciseShuffle';
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

  // Initialize progress state for each exercise
  const [exerciseProgress, setExerciseProgress] = useState(
    plan.exercises.map(() => 0) // Start with 0 progress for each exercise
  );

  // Use effect hook to set all the array exerciseprogress to zero when the component mounts
  useEffect(() => {
    setExerciseProgress(plan.exercises.map(() => 0));
  }, [plan.exercises]);


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

  const handleProgressDecrease = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress => 
      currentProgress.map((progress,index)=>
        index === exerciseIndex ?
        Math.max(progress - 100 / plan.exercises[exerciseIndex].sets,0) :
        progress
      )
    );
  }

  // Calculate overall exercise progress
  const overallProgress = exerciseProgress.reduce((acc, cur) => acc + cur, 0) / plan.exercises.length;

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
        {plan.exercises.map((exercise, index) => (
          <Card className="my-2" key={index}>
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
              {/* <ExerciseHelperDialog 
                exerciseName={exercise.name}
              /> */}
              <ExerciseShuffleDialog
                exerciseName={exercise.name}
                currentExerciseList={plan.exercises.map(exercise => exercise.name)}
              />
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
            <CardFooter className="min-h-8">
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
          </Card>
        ))}
      </ul>
      {overallProgress==100? (
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
            {/* <AlertDialogTitle>Your workout</AlertDialogTitle> */}
            <AlertDialogDescription>
              <div className="space-y-2 bg-gray-100 p-4 rounded-md">
                <div className="font-bold text-xl">
                Gym Workout for {today}
                </div>
                {plan.exercises.map((exercise, index) => (
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

      ):
      (
        <div className="text-center text-lg">
            Keep going! 💪
        </div>
      )}
      
    </div>
  );
};

function constructEncodedLink(workout_name : string): string {
  const encodedWorkoutName = encodeURIComponent(workout_name.toLowerCase());
  return `https://duckduckgo.com/?q=%5C${encodedWorkoutName}%20insite%20acefitness`;
}

export default WorkoutPlan;