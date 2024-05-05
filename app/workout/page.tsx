'use client';

import React, { useState } from 'react';
import CreateWorkoutButton from '@/components/CreateWorkoutButton';
import { Button } from '@/components/ui/button';
import WorkoutPlan from '@/components/WorkoutPlan';
import { ButtonLoading } from '@/components/ButtonLoading';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from '@radix-ui/react-checkbox';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Enum for workout types
const WorkoutType = z.enum(['full-body', 'upper-body', 'lower-body']);

// Schema for a checkbox item
const CheckboxItem = z.object({
  id: z.string(),  // assuming ID is a string; adjust the type if needed
  label: z.string()
});

// List of checkbox items
const CheckboxList = z.array(CheckboxItem);

// Enum for workout duration
const WorkoutDuration = z.enum(['30 min', '1 hour']);

// Combined form schema
const formSchema = z.object({
  workoutType: WorkoutType,
  chosenItems: CheckboxList,
  workoutDuration: WorkoutDuration
});

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000';

export default function HomePage() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const workoutItems = [
    {
      id: "dumbbells",
      label: "Dumbbells",
    },
    {
      id: "barbells",
      label: "Barbells",
    },
    {
      id: "cable crossover machine",
      label: "Cable Crossover Machine",
    },
    {
      id: "bench press",
      label: "Bench Press",
    },
    {
      id: "adjustable bench",
      label: "Adjustable bench",
    },
    {
      id: "lat pull down machine",
      label: "Lat Pull Down machine",
    },
    {
      id: "ab roller",
      label: "Ab Roller",
    },
    {
      id: "leg extension machine",
      label: "Leg Extension machine",
    },
    {
      id: "treadmill",
      label: "Treadmill",
    },
    {
      id: "spin-bike",
      label: "Spin Bike",
    },
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutType: 'full-body',
      chosenItems: workoutItems,
      workoutDuration: '30 min',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

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
            Jumpstart your gym routine by clicking below. You&apos;ll receive AI-generated exercise recommendations. Remember to exercise safely and consult a professional if necessary.
            </p>
          </div>
        )}
        {loading ? (
          <ButtonLoading />
        ) : (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <Form {...form} >
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle>Workout setup</DrawerTitle>
                          <DrawerDescription>Choose your preferences</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                          <FormField 
                            control={form.control}
                            name="workoutType"
                            render={({field})=>(
                              <FormItem>
                                  <FormLabel>
                                    Choose your gym workout type
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="mb-6 pt-2"
                                      >
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="full-body" id="r1" />
                                        </FormControl>
                                        <FormLabel htmlFor="r1">Full-Body</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="upper-body" id="r2" />
                                        </FormControl>
                                        <FormLabel htmlFor="r2">Upper Body</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="lower-body" id="r3" />
                                        </FormControl>
                                        <FormLabel htmlFor="r3">Lower Body</FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                              control={form.control}
                              name="chosenItems"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel className="text-base">Equipment</FormLabel>
                                    <FormDescription>
                                      Select the equipements you have available to exercise
                                    </FormDescription>
                                  </div>
                                  {workoutItems.map((item) => (
                                    <FormField
                                      key={item.id}
                                      control={form.control}
                                      name="chosenItems"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value.some((selectedItem) => selectedItem.id === item.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, { id: item.id, label: item.label }])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (selectedItem) => selectedItem.id !== item.id)
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {item.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          <FormField 
                            control={form.control}
                            name="workoutDuration"
                            render={({field})=>(
                              <FormItem>
                                  <FormLabel>
                                    And how much time do you have available?
                                  </FormLabel>
                                  <FormControl>
                                    <RadioGroup 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="mb-6 pt-2"
                                      >
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="30 min" id="r1" />
                                        </FormControl>
                                        <FormLabel htmlFor="r1">Fast exercise, up to 30 min</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="1 hour" id="r2" />
                                        </FormControl>
                                        <FormLabel htmlFor="r2">Complete exercise, close to 1 hour</FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                            )}
                          />
                          </div>
                          <DrawerFooter>
                            <Button type="submit">Create Workout</Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                      </div>
                    </form>
                </Form>
              </DrawerContent>
            </Drawer>
          
        )}
        {workoutPlan && (
          <WorkoutPlan plan={{ exercises: workoutPlan }} />
        )}
      </div>
    </div>
  );
}
