'use client';

import React, {useState, useEffect} from 'react';
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
import { Skeleton } from './ui/skeleton';
  
type ExerciseDetails = {
    explanation: string;
    imageUrl: string;
}

const ExerciseHelperDialog = ({exerciseName} : {exerciseName:string}) => {
    const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const fetchExerciseDetails = async () => {
        setLoading(true);
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
          setExerciseDetails(data);
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


    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDialogOpen}>
                    <MdHelpOutline className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            {dialogVisible && (
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{exerciseName}</AlertDialogTitle>
                    { loading ? (
                        <div className="flex flex-col space-y-3">
                            <div className="text-base text-slate-400 mb-2">An AI generated tutorial is beeing created, hold on...</div>
                            <Skeleton className="h-[125px] w-full rounded-xl" />
                            <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    ):(
                        <>
                            {exerciseDetails && (
                            <>
                                <img src={exerciseDetails?.imageUrl} alt={exerciseName} style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'cover', borderRadius: '5%' }} />
                                <AlertDialogDescription className="mt-4">
                                {exerciseDetails?.explanation}
                                </AlertDialogDescription>
                            </>
                            )}
                        </>
                    )
                    }
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDialogVisible(false)}>Got it!</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            )}
        </AlertDialog>
    );
}

export default ExerciseHelperDialog;
  