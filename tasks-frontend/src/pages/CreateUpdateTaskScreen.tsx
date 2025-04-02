import React, { useEffect, useState } from 'react';
import { Button, Input, Textarea, Spacer, Card, Chip } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TaskPriority } from '../types/TaskPriority';
import { DatePicker } from '@nextui-org/date-picker';
import { TaskStatus } from '../types/TaskStatus';
import { parseDate } from '@internationalized/date';
import useCreateTask from '../tanskquery/queries/task/useCreateTask';
import useUpdateTask from '../tanskquery/queries/task/useUpdateTask';
import useFetchTasks from '../tanskquery/queries/task/useFetchTasks';
import useFecthTaskList from '../tanskquery/queries/taskList/useFecthTaskList';

const CreateUpdateTaskScreen = () => {
  const { listId, taskId } = useParams<{ listId: string; taskId?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  // Custom hooks
  const { data: taskLists, isPending: taskListLoading } = useFecthTaskList();
  const {
    data: taskData,
    isPending: taskLoading,
    isError: taskError,
  } = useFetchTasks(listId || '');
  const {
    mutateAsync: updateTask,
    isPending: updateLoading,
    isError: updateError,
  } = useUpdateTask();
  const {
    mutateAsync: createTask,
    isPending: createLoading,
    isError: createError,
  } = useCreateTask();

  const isUpdate = Boolean(taskId);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if we have task lists data
        if (taskLists && taskId) {
          // Find the specific task in the task data
          const loadedTask = taskData
            ? taskData.find((task) => task.id === taskId)
            : null;
          if (loadedTask) {
            setTitle(loadedTask.title);
            setDescription(loadedTask.description || '');
            setDueDate(
              loadedTask.dueDate ? new Date(loadedTask.dueDate) : undefined,
            );
            setPriority(loadedTask.priority || TaskPriority.MEDIUM);
            setStatus(loadedTask.status);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId, taskLists, taskData]);

  // Watch for task updates
  useEffect(() => {
    if (taskData && taskId) {
      const currentTask = taskData.find((task) => task.id === taskId);
      if (currentTask) {
        setTitle(currentTask.title);
        setDescription(currentTask.description || '');
        setDueDate(
          currentTask.dueDate ? new Date(currentTask.dueDate) : undefined,
        );
        setPriority(currentTask.priority || TaskPriority.MEDIUM);
        setStatus(currentTask.status);
      }
    }
  }, [taskData, taskId]);

  const handleSubmit = async () => {
    try {
      if (!listId) return;

      if (isUpdate && taskId) {
        await updateTask({
          taskListId: listId,
          taskId,
          task: {
            id: taskId,
            title,
            description,
            dueDate,
            priority,
            status,
          },
        });
      } else {
        await createTask({
          taskListId: listId,
          task: {
            id: undefined,
            title,
            description,
            dueDate,
            priority,
            status: undefined,
          },
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  };

  if (
    isLoading ||
    taskListLoading ||
    taskLoading ||
    updateLoading ||
    createLoading
  ) {
    return <div>Loading...</div>;
  }

  const displayError = error || taskError || updateError || createError;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          aria-label="Go back"
          onClick={() => navigate(`/task-lists/${listId}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {isUpdate ? 'Update Task' : 'Create Task'}
        </h1>
      </div>
      {displayError && (
        <Card className="mb-4 p-4 text-red-500">{displayError}</Card>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Textarea
          label="Description"
          placeholder="Enter task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Spacer y={1} />
        <DatePicker
          label="Due date (optional)"
          defaultValue={
            dueDate ? parseDate(formatDateForPicker(dueDate)!) : undefined
          }
          onChange={(newDate) =>
            handleDateChange(newDate ? new Date(newDate.toString()) : null)
          }
        />
        <Spacer y={4} />
        <div className="flex justify-between mx-auto gap-2">
          {Object.values(TaskPriority).map((p) => (
            <Chip
              key={p}
              color={priority === p ? 'primary' : 'default'}
              variant={priority === p ? 'solid' : 'faded'}
              onClick={() => setPriority(p)}
              className="cursor-pointer"
            >
              {p} Priority
            </Chip>
          ))}
        </div>
        <Spacer y={4} />
        <Button type="submit" color="primary" onClick={handleSubmit} fullWidth>
          {isUpdate ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskScreen;
