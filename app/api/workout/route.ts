import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import defaultItems from '@/lib/defaultWorkoutItemsHome';

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
  const maxExercises = Math.floor((parseInt(workoutDuration))/ 10)+2;
  
  try {
    // Setup the prompt
    const prompt = `
    You are an experienced gym coach specializing in personalized fitness routines. Your task is to create a ${workoutDuration} minute ${workoutType} gym workout using the following available equipment:
    ${equipmentList}.

    Criteria for this plan:
    1. Ensure each exercise targets muscle groups aligned to workout goal, given by ${workoutType} workout type.
    2. Ensure the exercises are varied and effective, to prevent monotony and target the intended muscle groups.
    3. Ensure the total workout duration, fits within the ${workoutDuration} minutes timeframe.
    4. Your answer should be in Portuguese - Brazil.

    Your response should ALWAYS be a list of exercises in JSON format, where each exercise is an object with the following TypeScript type:

    type Exercise = {
      name: string; // In Portuguese - Brazil
      sets: number;
      reps: number;
      duration: number; // Duration in minutes, excluding rest period
      muscleGroup: string; // Muscle group targeted by the exercise, should be aligned with the ${workoutType}
    }

    Examples of how to properly suggested exercises aligned with ${workoutType}:
    
    If the ${workoutType} is full-body then all the exercises are accptable.

    If the ${workoutType} is upper-body then the exercises should target the following muscle groups:
    - Peito, 
    - Costas, 
    - Ombros, 
    - Bíceps, 
    - Tríceps,
    - Abs
    
    If the ${workoutType} is lower-body then the exercises should target the following muscle groups:
    - Pernas,
    - Quadríceps,
    - Panturrilhas,
    - Glúteos
    - Abs

    The output should match this data schema:

    {
      "exercises": [
        {
          "name": "Levantamento Terra",
          "sets": 3,
          "reps": 12,
          "duration": 10,  // Exercise duration
          "muscleGroup": "Pernas",
        },
        {
          "name": "Desenvolvimento com Halteres",
          "sets": 3,
          "reps": 12,
          "duration": 10,  // Exercise duration
          "muscleGroup": "Ombros",
        }
      ]
    }

    Ensure the generated workout plan strictly follows the specified workout type and includes the corresponding muscle groups.

    [Timestamp: ${timestamp}]
    `;

    // Ask OpenAI for a streaming completion given the prompt
    // The prompt includes the timestamp to ensure uniqueness
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: "json_object" },
      temperature: 0.7,
      messages: [
        {"role": "system", "content": prompt},
        {"role": "user", "content": `Me sugira um treino de academia para completar em ${workoutDuration} minutos com até ${maxExercises} exercícios focado em ${workoutType}.`}
      ]
    });

    console.log('Prompt:', prompt);

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
