import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import defaultItems from '@/lib/defaultWorkoutItemsHome';
import fullGymItems from '@/lib/defaultWorkoutItemsHomeBodytech';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ItemType = {
  id:string;
  label:string;
}

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Parse the JSON payload
  const { workoutType = 'full-body', workoutDuration = '30', chosenItems }: {
    workoutType?: string,
    workoutDuration?: string,
    chosenItems?: ItemType[]
  } = await req.json();

  // Default items if none provided

  const equipmentList = chosenItems?.length ? chosenItems.map(item => item.label).join('; ') : defaultItems.map(item => item.label).join('; ');
  const timestamp = new Date().toISOString();
  const maxNumberOfExercises = Math.round(parseInt(workoutDuration) / 10);
  
    try {
  
      // Setup the prompt
      const prompt = `
      You are an experienced gym coach specializing in personalized fitness routines. Your task is to create a ${workoutDuration} minute ${workoutType} gym workout using the following available equipment:
      ${equipmentList}.

      Criteria for this plan:
      1. Make the exercises suitable for achieving common fitness goals (e.g., strength, endurance, or muscle building).
      2. Ensure the exercises are varied and effective, to prevent monotony and target the intended muscle groups.
      3. Include fun or unique exercises to keep the workout engaging.
      4. Ensure the total workout duration, including 2 min rest times between exercises, fits within the ${workoutDuration} minutes timeframe.

      Your response should ALWAYS be a list of exercises in JSON format, where each exercise is an object with the following TypeScript type:

      type Exercise = {
        name: string;
        sets: number;
        reps: number;
        duration: number; // Duration in minutes, excluding rest period
      }

      The output should match this data schema:

      {
        "exercises": [
          {
            "name": "Barbell Squat",
            "sets": 3,
            "reps": 12,
            "duration": 10  // Exercise duration
          },
          {
            "name": "Dumbbell Shoulder Press",
            "sets": 3,
            "reps": 12,
            "duration": 10  // Exercise duration
          }
        ]
      }

      The total workout time calculated should be the sum of the exercise durations plus 5 minutes of rest between each exercise. 

      Keep the plan effective, safe, and fun to follow.

      [Timestamp: ${timestamp}]
      `
        // Ask OpenAI for a streaming completion given the prompt
        // The prompt includes the timestamp to ensure uniqueness
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 1.3,
          response_format: { type: "json_object" },
          messages: [
            {"role": "system", "content": prompt},
            {"role": "user", "content": `Suggest me up to ${maxNumberOfExercises} gym exercises to complete in ${workoutDuration} minutes`}
          ]
        });
  
        const suggestedWorkout = response.choices[0].message.content;
        if (suggestedWorkout) {
          const formatJSON = JSON.parse(suggestedWorkout.replace(/\n\s+/g, ''));
          return NextResponse.json({ message: "Success", formatJSON }, { status: 200 });
        }
      } catch (error) {
        return NextResponse.json({ message: "Error", error }, {
          status: 500
        });
      }
    
}
