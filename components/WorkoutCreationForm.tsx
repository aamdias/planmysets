// components/WorkoutCreationForm.tsx

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Badge } from "@/components/ui/badge";
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';
import { DialogClose } from '@radix-ui/react-dialog';

const formSchema = z.object({
  workout_focus: z.enum(['full_body', 'upper_body', 'lower_body', 'pull_workout', 'push_workout']),
  workout_location: z.enum(['home_gym', 'external_gym']),
  workout_duration: z.number().min(30).max(90),
});

type FormSchema = z.infer<typeof formSchema>;

const WorkoutCreationForm = ({ onSubmit }: { onSubmit: (values: FormSchema) => void }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workout_focus: 'full_body',
      workout_location: 'home_gym',
      workout_duration: 45,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white px-4 py-2 rounded">Criar com IA</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="ml-2 mr-4 w-full pl-3">
          <DialogTitle>Novo treino</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="ml-2 mr-4 w-full px-4">
              {/* <Separator /> */}
              <div className="pb-4">
                <FormField
                  control={form.control}
                  name="workout_focus"
                  render={({ field }) => (
                    <FormItem>
                      <div>
                        <FormLabel className="text-base">Foco</FormLabel>
                        <FormDescription>
                          Escolha o foco do seu treino
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 gap-2 pt-2"
                        >
                          <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center">
                            <FormControl>
                              <RadioGroupItem value="full_body" id="r1" />
                            </FormControl>
                            <FormLabel htmlFor="r1" className="ml-2">Corpo todo</FormLabel>
                          </Card>
                          <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center">
                            <FormControl>
                              <RadioGroupItem value="upper_body" id="r2" />
                            </FormControl>
                            <FormLabel htmlFor="r2" className="ml-2">Membros superiores</FormLabel>
                          </Card>
                          <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center">
                            <FormControl>
                              <RadioGroupItem value="lower_body" id="r3" />
                            </FormControl>
                            <FormLabel htmlFor="r3" className="ml-2">Membros inferiores</FormLabel>
                          </Card>
                          <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center">
                            <FormControl>
                              <RadioGroupItem value="pull_workout" id="r4" />
                            </FormControl>
                            <FormLabel htmlFor="r4" className="ml-2">Costas, bíceps e antebraços</FormLabel>
                          </Card>
                          <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center">
                            <FormControl>
                              <RadioGroupItem value="push_workout" id="r5" />
                            </FormControl>
                            <FormLabel htmlFor="r5" className="ml-2">Peito, tríceps e ombros</FormLabel>
                          </Card>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workout_location"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mt-4">
                        <FormLabel className="text-base">Localização</FormLabel>
                        <FormDescription>
                          Quais equipamentos estão disponíveis
                        </FormDescription>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="pt-2"
                        >
                          <div className="flex flex-col space-y-2">
                            <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center gap-2">
                              <FormControl>
                                <RadioGroupItem value="home_gym" id="home_gym" />
                              </FormControl>
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="home_gym">
                                  <AccordionTrigger className="w-full border-none">
                                    Treino em casa
                                  </AccordionTrigger>
                                  <AccordionContent>
                                  <div className="text-slate-700 mb-2">Lista de equipamentos inclusos</div>
                                    {defaultItems.map((item) => (
                                      <Badge key={item.id} className="mr-2 mb-2">{item.label}</Badge>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </Card>
                            <Card className="bg-[#EFF4F8] p-2 flex flex-row items-center gap-2">
                              <FormControl>
                                <RadioGroupItem value="external_gym" id="external_gym" />
                              </FormControl>
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="external_gym">
                                  <AccordionTrigger className="w-full border-none">
                                    Treino na academia
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="text-slate-700 mb-2">Lista de equipamentos inclusos</div>
                                    {fullGymItems.map((item) => (
                                      <Badge key={item.id} className="mr-2 mb-2">{item.label}</Badge>
                                    ))}
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </Card>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workout_duration"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mt-4">
                        <FormLabel className="text-base">Duração</FormLabel>
                        <FormDescription>
                          Quanto tempo você tem disponível
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="workout_duration"
                          render={({ field }) => (
                            <div className="flex flex-col items-start space-y-2 pt-2">
                              <Slider
                                min={30}
                                max={90}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                              <span className="text-slate-700">{field.value} min</span>
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-between mt-4">
                <DialogClose asChild>
                    <Button variant="outline" type="button">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Criar com IA</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutCreationForm;
