import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { GrPowerReset } from "react-icons/gr";
import { BsCheckCircle } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaShuffle, FaPlay, FaCircle } from "react-icons/fa6";
import { Badge } from './ui/badge';
import * as Progress from '@radix-ui/react-progress';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Exercise } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';

type WorkoutPlanProps = {
  plan: {
    exercises: Exercise[];
  };
  isAllCardsLoading?: boolean;
  availableEquipement?: string;
  workoutFocus?: string;
  workoutId?: string;
};

const WorkoutPlan = ({ plan, isAllCardsLoading = false, availableEquipement, workoutFocus, workoutId }: WorkoutPlanProps) => {
  const [exercises, setExercises] = useState(plan.exercises);
  const [exerciseProgress, setExerciseProgress] = useState(plan.exercises.map(() => 0));
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);
  const [explanations, setExplanations] = useState<{ [key: number]: string }>({});
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [workoutRating, setWorkoutRating] = useState<string | undefined>(undefined);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setExerciseProgress(plan.exercises.map(() => 0));
  }, [plan.exercises]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !isTimerPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isTimerPaused]);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setIsTimerPaused(false);
  };

  const handlePauseTimer = () => {
    setIsTimerPaused(true);
    setIsTimerActive(false);
  };

  const handleResumeTimer = () => {
    setIsTimerPaused(false);
    setIsTimerActive(true);
  };

  const handleEndWorkout = () => {
    setShowDialog(true);
    setIsTimerActive(false);
  };

  const handleConfirmEndWorkout = async () => {
    const workoutCompletionData = {
      workoutId: workoutId,
      rating: workoutRating,
      status: 'Finalizado',
    };

    const response = await fetch('/api/workoutUpdate', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutCompletionData),
    });

    if (response.ok) {
      setShowDialog(false);
      setShowSummary(true);
    } else {
      console.error('Error updating workout:', await response.json());
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressUpdate = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress =>
      currentProgress.map((progress, index) =>
        index === exerciseIndex ? Math.min(progress + 100 / exercises[exerciseIndex].sets, 100) : progress
      )
    );
  };

  const handleProgressDecrease = (exerciseIndex: number) => {
    setExerciseProgress(currentProgress =>
      currentProgress.map((progress, index) =>
        index === exerciseIndex ? Math.max(progress - 100 / exercises[exerciseIndex].sets, 0) : progress
      )
    );
  };

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
        body: JSON.stringify({ exerciseName, currentExerciseList, availableEquipement }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const suggestedExercise = JSON.parse(data.suggestedWorkout).suggestedExercise[0];

      setExercises(currentExercises =>
        currentExercises.map((exercise, index) =>
          index === exerciseIndex ? suggestedExercise : exercise
        )
      );

      setExerciseProgress(currentProgress =>
        currentProgress.map((progress, index) =>
          index === exerciseIndex ? 0 : progress
        )
      );

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

    if (explanations[exerciseIndex]) return;

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

  const overallProgress = exerciseProgress.reduce((acc, cur) => acc + cur, 0) / exercises.length;
  const today = format(new Date(), 'dd MMMM yyyy', { locale: ptBR });

  return (
    <div className="flex flex-col items-center">
      <div className="my-6">
        {!showSummary && !isTimerActive && !isTimerPaused ? (
          <Button onClick={handleStartTimer} className="rounded-3xl">
            <FaPlay className="mr-2" />
            Começar
          </Button>
        ) : !showSummary && isTimerActive ? (
          <Card className="bg-[#F6F9FB] w-full p-4 rounded-md w-[296px] mb-[-28px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Tempo</h2>
              <Badge variant="outline" className="text-zinc-700">
                <FaCircle className="mr-2" fill="#60D36C" />
                Ativo
              </Badge>
            </div>
            <div className="text-2xl font-mono">{formatTime(timer)}</div>
            <div>
              <h2 className="font-medium text-lg mt-4">Progresso</h2>
            </div>
            <div className="relative w-full h-8 border-solid border border-slate-200 rounded-2xl overflow-hidden my-4">
              <Progress.Root value={overallProgress} max={100} className="absolute inset-0">
                <Progress.Indicator className="bg-[#EB5864] w-full h-8 transition-transform duration-[660ms] ease" style={{ transform: `translateX(-${100 - overallProgress}%)` }} />
              </Progress.Root>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {Math.round(overallProgress)}%
              </div>
            </div>
            <Button variant="outline" onClick={handlePauseTimer}>Pausar</Button>
          </Card>
        ) : !showSummary && (
          <Card className="bg-[#F6F9FB] w-full p-4 rounded-md w-[296px] mb-[-28px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Tempo</h2>
              <Badge variant="outline" className="text-zinc-700">
                <FaCircle className="mr-2" fill="#ffc34d" />
                Pausado
              </Badge>
            </div>
            <div className="text-2xl font-mono">{formatTime(timer)}</div>
            <div>
              <h2 className="font-medium text-lg mt-4">Progresso</h2>
            </div>
            <div className="relative w-full h-8 border-solid border border-slate-200 rounded-2xl overflow-hidden my-4">
              <Progress.Root value={overallProgress} max={100} className="absolute inset-0">
                <Progress.Indicator className="bg-[#EB5864] w-full h-full transition-transform duration-[660ms] ease" style={{ transform: `translateX(-${100 - overallProgress}%)` }} />
              </Progress.Root>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {Math.round(overallProgress)}%
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleResumeTimer}>Continuar</Button>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleEndWorkout}>Finalizar</Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-none">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-white">Parabéns</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p className="text-gray-500 font-medium text-lg">Você concluiu</p>
                    <p className="text-3xl font-bold text-gray-300">{`Treino de ${workoutFocus} do dia ${today}`}</p>
                    <p className="mt-4 text-gray-500 font-medium text-lg">Tempo na academia</p>
                    <p className="text-3xl">{`${formatTime(timer)}`}</p>
                    <div className="mt-2">
                      <label htmlFor="workoutRating" className="block text-lg font-medium text-gray-500 mb-2">
                        Avalie seu treino
                      </label>
                      <Select value={workoutRating || ''} onValueChange={setWorkoutRating} >
                        <SelectTrigger id="workoutRating" className="mb-2 bg-zinc-700 border-none text-gray-400">
                          <SelectValue placeholder="Selecione a avaliação" />
                        </SelectTrigger>
                        <SelectContent className="mb-4 bg-zinc-700 border-none text-gray-300">
                          <SelectItem value="1">1 Estrela</SelectItem>
                          <SelectItem value="2">2 Estrelas</SelectItem>
                          <SelectItem value="3">3 Estrelas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogDescription>
                  <DialogClose asChild>
                    <button
                      className="text-white absolute right-[-2px] top-[-4px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                    >
                      <RxCross2 />
                    </button>
                  </DialogClose>
                  <DialogFooter >
                    <Button onClick={handleConfirmEndWorkout} className="mt-2 bg-white text-black">Avaliar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        )}
      </div>


      {!showSummary && (
      <ul className="my-2">
        {exercises.map((exercise, index) => (
          <Card className="my-2" key={index}>
            {isAllCardsLoading || loadingIndexes.includes(index) ? (
              <div className="p-4">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
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
                      {exercise.duration} minutos
                    </Badge>
                    <Badge variant="outline" className="mb-2 ml-2">
                      {exercise.muscleGroup}
                    </Badge>
                    <CardTitle className="max-w-52">{exercise.name}</CardTitle>
                    <CardDescription className="max-w-48 mt-2">
                      {exercise.sets > 1 && exercise.reps > 1 ? (
                        `${exercise.sets} sets de ${exercise.reps} repetições`
                      ) : (
                        `Set único`
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
                      <div key={`set-${setIndex}`} className="flex items-center justify-between w-full my-2 ">
                        <p>
                          Set nº{setIndex + 1}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button onClick={() => handleProgressUpdate(index)} variant="secondary" size="icon">
                            <BsCheckCircle />
                          </Button>
                          <Button onClick={() => handleProgressDecrease(index)} variant="outline" size="icon">
                            <GrPowerReset />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="min-h-8 flex flex-col">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="w-60 text-sm text-slate-500 mb-6 mt-[-16px]">
                      <AccordionTrigger onClick={() => handleExerciseHelp(index)}>Como fazer?</AccordionTrigger>
                      <AccordionContent className="text-sm text-slate-400 border-none flex flex-col items-start">
                        {explanations[index] ? explanations[index] : 'Gerando um tutorial com IA...'}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="relative w-60 h-8 border-solid border border-slate-200 rounded-2xl overflow-hidden">
                    <Progress.Root value={exerciseProgress[index]} max={100} className="absolute inset-0">
                      <Progress.Indicator className="bg-[#FEB9C1] w-full h-full transition-transform duration-[660ms] ease" style={{ transform: `translateX(-${100 - exerciseProgress[index]}%)` }} />
                    </Progress.Root>
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
      )}
      
      {showSummary && (
        <div className="mt-4 w-full max-w-md">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Badge variant="outline" className="text-zinc-700 mb-4">
                <FaCircle className="mr-2" fill="#60D36C" />
                Finalizado
              </Badge>
              <h2 className="text-lg font-medium">Resumo</h2>
              <p className="text-xl font-mono">{formatTime(timer)}</p>
            </CardHeader>
            <CardContent>
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between my-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">{exercise.name}</span>
                    <span className="text-sm text-gray-500">{`${exercise.sets} sets de ${exercise.reps} repetições`}</span>
                  </div>
                  <BsCheckCircle className="text-green-500" />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Compartilhar</Button>
              <Button variant="ghost">Sair do treino</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
