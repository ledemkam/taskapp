import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";



const deleteTask = async (taskListId: string, taskId: string): Promise<void> => {
        try {
            await axios.delete(`/api/task-lists/${taskListId}/tasks/${taskId}`);
        } catch (error) {
            // Convert to standard Error object
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to delete task");
        }
    }





const useDeleTask = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskListId, taskId }: { taskListId: string; taskId: string }) => deleteTask(taskListId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists"],
      });
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      // Handle error (e.g., show a notification)
    }
  })
}
export default useDeleTask