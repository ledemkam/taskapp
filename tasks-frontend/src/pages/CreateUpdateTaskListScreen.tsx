import React, { useState } from 'react';
import { Button, Input, Textarea, Spacer, Card } from '@nextui-org/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useUpdateTaskList from '../tanskquery/queries/taskList/useUpdateTaskList ';
import useCreateTaskList from '../tanskquery/queries/taskList/useCreateTaskList';
import useFecthTasList from '../tanskquery/queries/taskList/useFecthTaskList';

const CreateUpdateTaskListScreen: React.FC = () => {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string | undefined>('');
  const [description, setDescription] = useState<string | undefined>('');
  const [error, setError] = useState<string>('');

  // Query hooks
  const { mutateAsync: updateTaskList } = useUpdateTaskList();
  const { mutateAsync: createTaskList } = useCreateTaskList();

  // Fetch data if we're updating
  const { data: taskLists, isPending: taskListLoading } = useFecthTasList();
  const taskList = taskLists?.find((tl) => tl.id === listId);

  // Track if we're updating an existing list
  const isUpdate = !!listId;

  // Populate form when task list data is loaded
  React.useEffect(() => {
    if (taskLists) {
      setTitle(taskList?.title);
      setDescription(taskList?.description);
    }
  }, [taskList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isUpdate && listId) {
        await updateTaskList({
          id: listId,
          taskList: {
            id: listId,
            title: title || '',
            description: description || '',
            count: 0,
            progress: 0,
            tasks: [],
          },
        });
      } else {
        await createTaskList({
          id: undefined, // Assign undefined for new task lists
          title: title || '',
          description: description || '',
          count: 0,
          progress: 0,
          tasks: [],
        });
      }

      // Success navigate to home
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {isUpdate ? 'Update Task List' : 'Create Task List'}
        </h1>
      </div>

      {taskListLoading && <p>Loading task list data...</p>}
      {error.length > 0 && <Card>{error}</Card>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          placeholder="Enter task list title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Textarea
          label="Description"
          placeholder="Enter task list description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Spacer y={1} />
        <Button type="submit" color="primary">
          {isUpdate ? 'Update Task List' : 'Create Task List'}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskListScreen;
