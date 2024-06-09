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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Check } from 'lucide-react';
import * as CheckboxRadix from '@radix-ui/react-checkbox';
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
const WorkoutDuration = z.enum(['30', '60']);

// Enum for Gym Equipment
const GymEquipment = z.enum(['defaultItems', 'fullGymItems']);

// Combined form schema
const formSchema = z.object({
  workoutType: WorkoutType,
  gymEquipment: GymEquipment,
  workoutDuration: WorkoutDuration
});

const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3001';

export default function HomePage() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('defaultItems');

  const workoutItems = activeTab === 'defaultItems' ? defaultItems : fullGymItems;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutType: 'full-body',
      gymEquipment: 'defaultItems',
      workoutDuration: '30',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log('Fetching workout plan...');
  
      // Prepare the JSON body with the form values
      const requestBody = JSON.stringify({
        workoutType: values.workoutType,
        workoutDuration: values.workoutDuration,
        gymEquipment: values.gymEquipment,
        chosenItems: activeTab === 'defaultItems' ? defaultItems : fullGymItems,
      });
  
      console.log('Request Body:', requestBody);
      console.log('Domain:', domain);
      const response = await fetch(`${domain}/api/workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setWorkoutPlan(data.formatJSON?.exercises);
      console.log('Workout plan fetched successfully:', data);
    } catch (error) {
      console.error('Failed to fetch workout plan:', error);
    } finally {
      setLoading(false);
    }
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

  // const allItemsChecked = workoutItems.every(item => form.watch("chosenItems").some(selectedItem => selectedItem.id === item.id));

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
                <Button variant="secondary">Create new workout</Button>
              </DrawerTrigger>
              <DrawerContent>
                <Form {...form} >
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle>Workout setup</DrawerTitle>
                          <DrawerDescription>Choose your preferences</DrawerDescription>
                        </DrawerHeader>
                        <Separator />
                        <div className="px-4 pb-4">
                          <FormField 
                            control={form.control}
                            name="workoutType"
                            render={({field})=>(
                              <FormItem>
                                  <div className="mt-4">
                                    <FormLabel className="text-base">Workout Focus</FormLabel>
                                    <FormDescription>
                                      Choose your gym workout type
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <RadioGroup 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="pt-2"
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
                            name="gymEquipment"
                            render={({ field }) => (
                              <FormItem>
                                <div className="mt-4">
                                  <FormLabel className="text-base">Equipment</FormLabel>
                                  <FormDescription>
                                    Choose the type of gym equipment
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Tabs defaultValue="defaultItems" onValueChange={(value) => {
                                    field.onChange(value);
                                    setActiveTab(value);
                                  }}>
                                    <TabsList>
                                      <TabsTrigger value="defaultItems">Home Gym</TabsTrigger>
                                      <TabsTrigger value="fullGymItems">Well Equiped Gym</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="defaultItems">
                                      <ScrollArea className="h-20 overflow-y-auto rounded-md border px-2">
                                        <ul className="list-disc pl-5 space-y-1">
                                          {defaultItems.map((item) => (
                                            <li key={item.id}>{item.label}</li>
                                          ))}
                                        </ul>
                                      </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="fullGymItems">
                                      <ScrollArea className="h-20 overflow-y-auto rounded-md border px-2">
                                        <ul className="list-disc pl-5 space-y-1">
                                          {fullGymItems.map((item) => (
                                            <li key={item.id}>{item.label}</li>
                                          ))}
                                        </ul>
                                      </ScrollArea>
                                    </TabsContent>
                                  </Tabs>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField 
                            control={form.control}
                            name="workoutDuration"
                            render={({field})=>(
                              <FormItem>
                                  <div className="mt-4">
                                    <FormLabel className="text-base">Time</FormLabel>
                                    <FormDescription>
                                      Select how much time do you have available
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <RadioGroup 
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="mb-6 pt-2"
                                      >
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="30" id="r1" />
                                        </FormControl>
                                        <FormLabel htmlFor="r1">Fast exercise, up to 30 min</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="60" id="r2" />
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
