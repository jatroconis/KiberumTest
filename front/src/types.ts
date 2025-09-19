export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}
