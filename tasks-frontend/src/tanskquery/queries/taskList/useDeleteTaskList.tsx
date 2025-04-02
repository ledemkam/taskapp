import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteTaskList = async (id: string): Promise<void> => {
        try {
            await axios.delete(`/api/task-lists/${id}`);
        } catch (error) {
            // Convert to standard Error object
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Failed to delete task list");
        }
    }




const useDeleteTaskList = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTaskList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task-lists"],
      });
    },
    onError: (error) => {
      console.error("Error deleting task list:", error);
      // Handle error (e.g., show a notification)
    }
  });
}
export default useDeleteTaskList