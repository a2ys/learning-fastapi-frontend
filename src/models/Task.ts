export interface Task {
  id: number;
  task_name: string;
  status: "all" | "active" | "completed";
}
