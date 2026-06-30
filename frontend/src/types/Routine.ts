export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Routine {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  weight: number;
  reps: number;
}
