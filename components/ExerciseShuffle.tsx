'use client';

import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { MdHelpOutline } from "react-icons/md";
import { FaShuffle } from "react-icons/fa6";
import { Skeleton } from './ui/skeleton';

type SuggestedWorkoutDetails = {
    suggestedWorkout: string;
}

const ExerciseShuffleDialog = ({ exerciseName, currentExerciseList }: { exerciseName: string, currentExerciseList: string[] }) => {
    const [suggestedWorkoutDetails, setSuggestedWorkoutDetails] = useState<SuggestedWorkoutDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const fetchExerciseDetails = async () => {
        setLoading(true);
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
            setSuggestedWorkoutDetails(data);
        } catch (error) {
            console.error('Failed to fetch exercise details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = () => {
        setDialogVisible(true);
        fetchExerciseDetails(); // Call the fetch function only when the dialog is opened.
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDialogOpen}>
                    <FaShuffle className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            {dialogVisible && (
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{exerciseName}</AlertDialogTitle>
                        {loading ? (
                            <div className="flex flex-col space-y-3">
                                <div className="text-base text-slate-400 mb-2">An AI generated suggestion is being created, hold on...</div>
                                <Skeleton className="h-[125px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ) : (
                            <>
                                {suggestedWorkoutDetails && (
                                    <AlertDialogDescription className="mt-4">
                                        <pre>{suggestedWorkoutDetails?.suggestedWorkout}</pre>
                                    </AlertDialogDescription>
                                )}
                            </>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDialogVisible(false)}>Got it!</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            )}
        </AlertDialog>
    );
};

export default ExerciseShuffleDialog;
