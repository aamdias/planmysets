import React from 'react';
import { Button } from './ui/button';
import { BsStars } from "react-icons/bs";

type CreateWorkoutButtonProps = {
    onClick: () => void; // This specifies that onClick is a function that takes no arguments and doesn't return anything
  };
  

const CreateWorkoutButton = ({ onClick }:CreateWorkoutButtonProps) => {
  return (
    <Button className="max-w-60" onClick={onClick}>
      Create Workout
      <BsStars className="mx-2" />
    </Button>
  );
};

export default CreateWorkoutButton;