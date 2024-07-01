import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient'; // Assuming you have created this file as per the previous instructions
import defaultItems from '@/lib/defaultWorkoutItemsHome';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ItemType = {
  id: string;
  label: string;
};

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Parse the JSON payload
  const { workoutType = 'full-body', workoutDuration = '30', chosenItems, userId }: {
    workoutType?: string,
    workoutDuration?: string,
    chosenItems?: ItemType[],
    userId: string
  } = await req.json();

  // Default items if none provided
  const equipmentList = chosenItems?.length ? chosenItems.map(item => item.label).join('; ') : defaultItems.map(item => item.label).join('; ');
  const timestamp = new Date().toISOString();
  const maxExercises = Math.floor((parseInt(workoutDuration)) / 10) + 2;

  // Log the workout type
  console.log('Started API endpoint with the workout type of:', workoutType);

  try {
    // Default prompt
    let prompt = `
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
    
    If the ${workoutType} is full-body then all the exercises are acceptable.

    If the ${workoutType} is upper-body then the exercises should target the following muscle groups:
    - Chest, 
    - Backs, 
    - Shoulders, 
    - Biceps, 
    - Triceps,
    - Abs
    
    If the ${workoutType} is lower-body then the exercises should target the following muscle groups:
    - Legs,
    - Quadriceps,
    - Calves,
    - Glutes
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

    switch (workoutType) {
      case 'full-body':
        prompt = `
          You are an experienced gym coach specializing in personalized fitness routines. Your task is to create a ${workoutDuration} minute full-body gym workout using the following available equipment:
          ${equipmentList}.

          Criteria for this plan:
          1. Ensure each exercise targets various muscle groups for a balanced full-body workout.
          2. Ensure the exercises are varied and effective, to prevent monotony and target all major muscle groups.
          3. Ensure the total workout duration, fits within the ${workoutDuration} minutes timeframe.
          4. Your answer should be in Portuguese - Brazil.

          Your response should ALWAYS be a list of exercises in JSON format, where each exercise is an object with the following TypeScript type:

          type Exercise = {
            name: string; // In Portuguese - Brazil
            sets: number;
            reps: number;
            duration: number; // Duration in minutes, excluding rest period
            muscleGroup: string; // Muscle group targeted by the exercise
          }

          Ensure the generated workout plan includes a variety of exercises targeting different muscle groups.

          After the workout plan is generated double check your suggestions to ensure they are aligned with the full-body workout type and fit the ${workoutDuration} minutes timeframe.

          [Timestamp: ${new Date().toISOString()}]
        `;
        break;

      case 'upper-body':
        prompt = `
          You are an experienced gym coach specializing in personalized fitness routines. Your task is to create a ${workoutDuration} minute upper-body gym workout using the following available equipment:
          ${equipmentList}.

          Criteria for this plan:
          1. Ensure each exercise targets the upper-body muscle groups, including Chest, Back, Shoulders, Biceps, Triceps, and Abs.
          2. Ensure the exercises are varied and effective, to prevent monotony and target the intended muscle groups.
          3. Ensure the total workout duration, fits within the ${workoutDuration} minutes timeframe.
          4. Your answer should be in Portuguese - Brazil.

          Your response should ALWAYS be a list of exercises in JSON format, where each exercise is an object with the following TypeScript type:

          type Exercise = {
            name: string; // In Portuguese - Brazil
            sets: number;
            reps: number;
            duration: number; // Duration in minutes, excluding rest period
            muscleGroup: string; // Should be "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", or "Abs"
          }

          Ensure the generated workout plan strictly follows the specified workout type and includes the corresponding muscle groups.

          After the workout plan is generated double check your suggestions to ensure they are aligned with the upper-body workout type and fit the ${workoutDuration} minutes timeframe.

          [Timestamp: ${new Date().toISOString()}]
        `;
        break;

      case 'lower-body':
        prompt = `
          You are an experienced gym coach specializing in personalized fitness routines. Your task is to create a ${workoutDuration} minute lower-body gym workout using the following available equipment:
          ${equipmentList}.

          Criteria for this plan:
          1. Ensure each exercise targets the lower-body muscle groups, including Legs, Quadriceps, Calves, Glutes, and Abs.
          2. Ensure the exercises are varied and effective, to prevent monotony and target the intended muscle groups.
          3. Ensure the total workout duration, fits within the ${workoutDuration} minutes timeframe.
          4. Your answer should be in Portuguese - Brazil.

          Your response should ALWAYS be a list of exercises in JSON format, where each exercise is an object with the following TypeScript type:

          type Exercise = {
            name: string; // In Portuguese - Brazil
            sets: number;
            reps: number;
            duration: number; // Duration in minutes, excluding rest period
            muscleGroup: string; // Should be "Pernas", "Quadríceps", "Panturrilhas", "Glúteos", or "Abs"
          }

          Ensure the generated workout plan strictly follows the specified workout type and includes the corresponding muscle groups.

          After the workout plan is generated double check your suggestions to ensure they are aligned with the lower-body workout type and fit the ${workoutDuration} minutes timeframe.

          [Timestamp: ${new Date().toISOString()}]
        `;
        break;
    }

    // Ask OpenAI for a streaming completion given the prompt
    // The prompt includes the timestamp to ensure uniqueness
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        {"role": "system", "content": prompt},
        {"role": "user", "content": `Me sugira um treino de academia para completar em ${workoutDuration} minutos com até ${maxExercises} exercícios focado em ${workoutType}.`}
      ]
    });

    console.log('Prompt:', prompt);
    console.log('Response:', response.choices[0].message.content)

    const suggestedWorkout = response.choices[0].message.content;
    if (suggestedWorkout) {
      const formatJSON = JSON.parse(suggestedWorkout.replace(/\n\s+/g, ''));

      const workoutFocusFormated = workoutType
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      console.log('Formatted JSON:', formatJSON)
      // Insert workout into Supabase
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            user_id: userId,
            workout_name: `Treino ${workoutFocusFormated}`,
            workout_date: new Date().toISOString(),
            workout_status: 'Não iniciado',
            workout_exercises: formatJSON.exercises,
            workout_progress: 0,
            workout_exercises_progress: [],
            workout_rating: 0,
            workout_focus: workoutFocusFormated,
          }
        ])
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ message: "Error inserting workout", error }, { status: 500 });
      }

      return NextResponse.json({ message: "Success", workout: data }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, {
      status: 500
    });
  }
}
