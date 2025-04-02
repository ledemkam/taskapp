import Task from "./Task";

interface TaskList {
  id?: string ;
  title: string;
  description: string ;
  count: number ;
  progress: number ;
  tasks: Task[] 
}
export default TaskList;
