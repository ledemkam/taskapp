import axios from 'axios';
import TaskList from '../../../types/TaskList';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createTaskList = async (taskList: TaskList): Promise<TaskList> => {
  try {
    const response = await axios.post('/api/task-lists', taskList);
    return response.data;
  } catch (error) {
    // Convert to standard Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create task list');
  }
};

const useCreateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskList: TaskList) => createTaskList(taskList),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['task-lists'],
      });
    },
  });
};

export default useCreateTaskList;
