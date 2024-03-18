type IExercise = {
  name: string;
  sets: ISet[];
};

type ISet = {
  reps: number;
  weight: number;
};

type IWorkoutTemplate = {
  name: string;
  userId: string;
  exercises: IExercise[];
  description: string;
  image: any;
};

export { IWorkoutTemplate, IExercise, ISet };
