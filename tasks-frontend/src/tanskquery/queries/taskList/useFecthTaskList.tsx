import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TaskList from '../../../types/TaskList';

const fetchTaskLists = async (): Promise<TaskList[]> => {
  try {
    const response = await axios.get('/api/task-lists');
    return response.data;
  } catch (error) {
    // Convert to standard Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch task lists');
  }
};

const useFecthTaskList = () => {
  return useQuery({
    queryKey: ['task-lists'],
    queryFn: fetchTaskLists,
  });
};

export default useFecthTaskList;
