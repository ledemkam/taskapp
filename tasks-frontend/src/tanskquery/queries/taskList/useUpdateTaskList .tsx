import axios from 'axios';
import TaskList from '../../../types/TaskList';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateTaskList = async (
  id: string,
  taskList: TaskList,
): Promise<TaskList> => {
  try {
    const response = await axios.put(`/api/task-lists/${id}`, taskList);
    return response.data;
  } catch (error) {
    // Convert to standard Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update task list');
  }
};

const useUpdateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskList }: { id: string; taskList: TaskList }) =>
      updateTaskList(id, taskList),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['task-lists', data.id],
      });
    },
  });
};
export default useUpdateTaskList;
