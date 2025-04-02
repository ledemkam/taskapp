import axios from "axios";
import Task from "../../../types/Task";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchTasks = async (taskListId: string): Promise<Task[]> => {
  try {
    const response = await axios.get(`/api/task-lists/${taskListId}/tasks`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch tasks");
  }
};

// Rename to useFetchTasks to match plural functionality
const useFetchTasks = (taskListId: string): UseQueryResult<Task[], Error> => {
  return useQuery({
    queryKey: ["tasks", taskListId],
    queryFn: () => fetchTasks(taskListId),
    // Optional: Add staleTime, refetchOnWindowFocus, etc. as needed
    enabled: !!taskListId, // Only fetch if taskListId is provided
  });
};

export default useFetchTasks;