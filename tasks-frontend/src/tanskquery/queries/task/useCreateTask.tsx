import axios from "axios";
import Task from "../../../types/Task";
import { useMutation, useQueryClient } from "@tanstack/react-query";



const createTask = async (taskListId: string, task: Task): Promise<Task> => {
    try {
        const response = await axios.post(`/api/task-lists/${taskListId}/tasks`, task);
        return response.data;
    } catch (error) {
        // Convert to standard Error object
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to create task");
    }
}



const useCreateTask = () => {
    const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskListId, task }: { taskListId: string; task: Task }) => createTask(taskListId, task),
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ["task-lists",data.id],
        });
    },
    onError: (error) => {
        console.error("Error creating task:", error);
        // Handle error (e.g., show a notification)
    }
  });
}
export default useCreateTask