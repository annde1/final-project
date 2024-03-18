import IWorkoutTemplate from "./template";
type IUserId = string;
type IWorkout = {
  title: string;
  createdAt: Date;
  duration: number;
  template: IWorkoutTemplate;
  userId: string;
  volume: number;
  likes: IUserId[];
  records: number;
};
export { IWorkout };
