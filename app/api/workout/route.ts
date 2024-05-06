import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

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
  const { workoutType = 'full-body', workoutDuration = '30 min', chosenItems }: {
    workoutType?: string,
    workoutDuration?: string,
    chosenItems?: ItemType[]
  } = await req.json();

  // Default items if none provided
  const defaultItems = [
    { id: "dumbbells", label: "Dumbbells" },
    { id: "barbells", label: "Barbells" },
    { id: "cable crossover machine", label: "Cable Crossover Machine" },
    { id: "bench press", label: "Bench Press" },
    { id: "adjustable bench", label: "Adjustable bench" },
    { id: "lat pull down machine", label: "Lat Pull Down machine" },
    { id: "ab roller", label: "Ab Roller" },
    { id: "leg extension machine", label: "Leg Extension machine" },
    { id: "treadmill", label: "Treadmill" },
    { id: "spin-bike", label: "Spin Bike" }
  ];

  const equipmentList = chosenItems?.length ? chosenItems.map(item => item.label).join('; ') : defaultItems.map(item => item.label).join('; ');
  const timestamp = new Date().toISOString();

  console.log('Workout Type:', workoutType);
  console.log('Workout Duration:', workoutDuration);
  console.log('Chosen Items:', equipmentList);
  
    try {
  
      // Setup the prompt
      const prompt = `
      You are an experienced gym coach and your job is to suggest a ${workoutDuration} ${workoutType} gym
        workout based on the following equipment available:
        ${equipmentList}.
        
        Your answer should ALWAYS be a list of exercises in a JSON format. 
        Each exercise is an object with the following type, as defined in TS:

        type Exercise = {
            name: string;
            sets: number;
            reps: number;
            image?: string; // Optional URL to an image for the exercise
        }

        And the output should match this data schema:

        {
            "exercises": [
                {
                "name": "Barbell Squat",
                "sets": 3,
                "reps": 12,
                "image": "https://example.com/barbellsquat.jpg"
                },
                {
                "name": "Dumbbell Shoulder Press",
                "sets": 3,
                "reps": 12,
                "image": "https://example.com/dumbbellshoulderpress.jpg"
                }
            ]
        }

        Please try to make an effective and fun workout plan.
        
        [Timestamp: ${timestamp}]

      `

      console.log('Prompt:',prompt)
        // Ask OpenAI for a streaming completion given the prompt
        // The prompt includes the timestamp to ensure uniqueness
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          temperature: 1.3,
          response_format: { type: "json_object" },
          messages: [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Suggest me a gym workout"}
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