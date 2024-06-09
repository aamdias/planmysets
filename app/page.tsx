'use client';

import React, { useState } from 'react';
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
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from '@radix-ui/react-scroll-area';
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PiSparkleFill } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";

// Enum for workout types
const WorkoutType = z.enum(['full-body', 'upper-body', 'lower-body']);

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
  
      console.log('Form values:', values)
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

  const today = format(new Date(), 'dd MMMM yyyy', { locale: ptBR });
  // const allItemsChecked = workoutItems.every(item => form.watch("chosenItems").some(selectedItem => selectedItem.id === item.id));

  return (
    <div className="flex flex-col justify-center items-center h-fit p-4 w-full">
      {/* Adjusted div to be more responsive with w-full */}
      <div className="flex flex-col justify-center items-center w-full max-w-4xl px-4 py-8 bg-white rounded shadow my-8">
        {/* Wrapped content in a new div for better control over its size and background */}
        {workoutPlan ? (
          <div>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-4xl mb-4 text-center">
            {/* Responsive font size */}
              Treino de <span className="text-zinc-400">{today}</span>
            </h1>
            <p className="max-w-[700px] text-center text-gray-500 md:text-lg/relaxed dark:text-gray-400 mb-4">
            Abaixo há uma sugestão de um treino para academia feito por IA. Sempre peça ajuda a um educador físico para garantir que você esteja executando os exercícios corretamente! Se preferir, clique novamente para criar um novo treino.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold md:text-5xl lg:text-5xl mb-4 text-center">
              {/* Responsive font size */}
              Bora treinar? 🏋️‍♂️
            </h1>
            <p className="max-w-[700px] text-center text-gray-500 md:text-xl/relaxed dark:text-gray-400 mb-4">
            Crie um treino clicando abaixo. Você receberá recomendações de exercícios geradas por IA. Lembre-se de se exercitar com segurança e consultar um profissional, se necessário.
            </p>
          </div>
        )}
        {loading ? (
          <ButtonLoading />
        ) : (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary"> 
                <PiSparkleFill className="mr-2 h-4 w-4" /> 
                Gerar novo treino
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <Form {...form} >
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle>Setup do Treino</DrawerTitle>
                          <DrawerDescription>Escolha suas preferências</DrawerDescription>
                        </DrawerHeader>
                        <Separator />
                        <div className="px-4 pb-4">
                          <FormField 
                            control={form.control}
                            name="workoutType"
                            render={({field})=>(
                              <FormItem>
                                  <div className="mt-4">
                                    <FormLabel className="text-base">Foco</FormLabel>
                                    <FormDescription>
                                      Escolha o foco do seu treino
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
                                        <FormLabel htmlFor="r1">Corpo todo</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="upper-body" id="r2" />
                                        </FormControl>
                                        <FormLabel htmlFor="r2">Membros superiores</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="lower-body" id="r3" />
                                        </FormControl>
                                        <FormLabel htmlFor="r3">Membros inferiores</FormLabel>
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
                                  <FormLabel className="text-base">Localização</FormLabel>
                                  <FormDescription>
                                    Quais equipamentos você tem disponíveis
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Tabs defaultValue="defaultItems" onValueChange={(value) => {
                                    field.onChange(value);
                                    setActiveTab(value);
                                  }}>
                                    <TabsList>
                                      <TabsTrigger value="defaultItems">Treino em casa</TabsTrigger>
                                      <TabsTrigger value="fullGymItems">Treino na academia</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="defaultItems">
                                    <ScrollArea className="h-24 overflow-y-auto rounded-md border px-2">
                                        <div className="grid grid-cols-1 gap-2">
                                          {defaultItems.map((item) => (
                                            <Card key={item.id} className="shadow-sm border border-gray-200">
                                              <CardContent className="p-2 flex flex-row justify-between items-center">
                                                <div className="text-sm">{item.label}</div>
                                                <div className="text-xl w-fit">
                                                  <FaCheckCircle className="h-4"/>
                                                  {/* {React.createElement(item.bodyIcon)} */}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      </ScrollArea>
                                    </TabsContent>
                                    <TabsContent value="fullGymItems">
                                    <ScrollArea className="h-24 overflow-y-auto rounded-md border px-2">
                                        <div className="grid grid-cols-1 gap-2">
                                          {fullGymItems.map((item) => (
                                            <Card key={item.id} className="shadow-sm border border-gray-200">
                                              <CardContent className="p-2 flex flex-row justify-between items-center">
                                                <div className="text-sm">{item.label}</div>
                                                <div className="text-sm w-fit">
                                                  <FaCheckCircle className="h-4"/>
                                                  {/* {React.createElement(item.bodyIcon)} */}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
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
                                    <FormLabel className="text-base">Tempo</FormLabel>
                                    <FormDescription>
                                      Quanto tempo você tem disponível
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
                                        <FormLabel htmlFor="r1">Exercício rápido, até 30 min</FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <FormControl>
                                          <RadioGroupItem value="60" id="r2" />
                                        </FormControl>
                                        <FormLabel htmlFor="r2">Exercício completo, aprox 1 hora</FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                            )}
                          />
                          </div>
                          <DrawerFooter className="flex flex-row justify-start items-center space-x-2">
                            <Button type="submit" className="w-36">Criar treino</Button>
                            <DrawerClose asChild>
                              <Button variant="outline" className="w-36">Cancelar</Button>
                            </DrawerClose>
                          </DrawerFooter>
                      </div>
                    </form>
                </Form>
              </DrawerContent>
            </Drawer>
          
        )}
        {workoutPlan && (
          <WorkoutPlan plan={{ exercises: workoutPlan }} isAllCardsLoading={loading} />
        )}
      </div>
    </div>
  );
}
