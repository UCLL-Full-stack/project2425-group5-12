export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  done: boolean;
  deadline: Date;
  owner: User;
  tags: Tag[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  done: boolean;
  tasks: Task[];
  members: User[];
  owner: User;
};

export type Tag = {
  id: number;
  title: string;
};

export type StatusMessage = {
  status: string;
  message: string;
} | null;
