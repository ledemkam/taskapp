import axios from "axios";
import Task from "../../../types/Task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateTask = async (taskListId: string, taskId: string, task: Task): Promise<Task> =>{
    try {
        const response = await axios.put(`/api/task-lists/${taskListId}/tasks/${taskId}`, task);
        return response.data;
    } catch (error) {
        // Convert to standard Error object
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to update task");
    }
}



const useUpdateTask = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskListId, taskId, task }: { taskListId: string; taskId: string; task: Task }) => updateTask(taskListId, taskId, task),
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ["task-lists",data.id],
        });
    },
    onError: (error) => {
        console.error("Error updating task:", error);
        // Handle error (e.g., show a notification)
    }
  


  })
}
export default useUpdateTask