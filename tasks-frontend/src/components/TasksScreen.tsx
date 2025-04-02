import { parseDate } from '@internationalized/date';
import {
  Button,
  Checkbox,
  DateInput,
  Progress,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
} from '@nextui-org/react';
import { ArrowLeft, Edit, Minus, Plus, Trash } from 'lucide-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Task from '../types/Task';
import { TaskStatus } from '../types/TaskStatus';
import useFecthTasList from '../tanskquery/queries/taskList/useFecthTaskList';
import useFetchTasks from '../tanskquery/queries/task/useFetchTasks';
import useUpdateTask from '../tanskquery/queries/task/useUpdateTask';
import useDeleteTaskList from '../tanskquery/queries/taskList/useDeleteTaskList';
import useDeleTask from '../tanskquery/queries/task/useDeleTask';

const TaskListScreen = (): ReactElement => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Query hooks
  const { data: taskLists } = useFecthTasList();
  const { data: tasks = [], isLoading: tasksLoading } = useFetchTasks(
    listId || '',
  );
  const { mutateAsync: updateTaskAsync } = useUpdateTask();
  const { mutateAsync: deleteTaskListAsync } = useDeleteTaskList();
  const { mutateAsync: deleteTaskAsync } = useDeleTask();

  // Find task list directly from taskLists
  const taskList = taskLists?.find((tl) => listId === tl.id);

  // Set loading state based on query status
  useEffect(() => {
    if (tasksLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [tasksLoading]);

  // Calculate completion percentage based on tasks
  const completionPercentage = React.useMemo(() => {
    if (tasks && tasks.length > 0) {
      const closedTaskCount = tasks.filter(
        (task) => task.status === TaskStatus.CLOSED,
      ).length;
      return tasks.length > 0 ? (closedTaskCount / tasks.length) * 100 : 0;
    }
    return 0;
  }, [tasks]);

  const toggleStatus = async (task: Task) => {
    if (!listId || !task.id) return;

    const updatedTask = { ...task };
    updatedTask.status =
      task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED;

    try {
      await updateTaskAsync({
        taskListId: listId,
        taskId: task.id,
        task: updatedTask,
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTaskList = async () => {
    if (!listId) return;

    try {
      await deleteTaskListAsync(listId);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete task list:', error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!listId || !task.id) return;

    try {
      await deleteTaskAsync({ taskListId: listId, taskId: task.id });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const tableRows = () => {
    if (!tasks || tasks.length === 0) {
      return (
        <TableRow>
        <TableCell className="text-center">-</TableCell>
        <TableCell className="text-center">No tasks found. Create your first one!</TableCell>
        <TableCell className="text-center">-</TableCell>
        <TableCell className="text-center">-</TableCell>
        <TableCell className="text-center">-</TableCell>
      </TableRow>
      );
    }

    return tasks.map((task) => (
      <TableRow key={task.id} className="border-t">
        <TableCell className="px-4 py-2">
          <Checkbox
            isSelected={task.status === TaskStatus.CLOSED}
            onValueChange={() => toggleStatus(task)}
            aria-label={`Mark task "${task.title}" as ${
              task.status === TaskStatus.CLOSED ? 'open' : 'closed'
            }`}
          />
        </TableCell>
        <TableCell className="px-4 py-2">{task.title}</TableCell>
        <TableCell className="px-4 py-2">{task.priority}</TableCell>
        <TableCell className="px-4 py-2">
          {task.dueDate && (
            <DateInput
              isDisabled
              defaultValue={parseDate(
                new Date(task.dueDate).toISOString().split('T')[0],
              )}
              aria-label={`Due date for task "${task.title}"`}
            />
          )}
        </TableCell>
        <TableCell className="px-4 py-2">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              aria-label={`Edit task "${task.title}"`}
              onClick={() =>
                navigate(`/task-lists/${listId}/edit-task/${task.id}`)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleDeleteTask(task)}
              aria-label={`Delete task "${task.title}"`}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  if (isLoading) {
    return <Spinner size="lg" className="mx-auto my-12" />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            aria-label="Go back to Task Lists"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-2xl font-bold mx-4">
            {taskList ? taskList.title : 'Unknown Task List'}
          </h1>

          <Button
            variant="ghost"
            aria-label={`Edit task list`}
            onClick={() => navigate(`/edit-task-list/${listId}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Progress
        value={completionPercentage}
        className="mb-4"
        aria-label="Task completion progress"
      />
      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        aria-label="Add new task"
        className="mb-4 w-full"
      >
        <Plus className="h-4 w-4" /> Add Task
      </Button>
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full" aria-label="Tasks list">
          <TableHeader>
            <TableColumn>Completed</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>{tableRows()}</TableBody>
        </Table>
      </div>
      <Spacer y={4} />
      <div className="flex justify-end">
        <Button
          color="danger"
          startContent={<Minus size={20} />}
          onClick={handleDeleteTaskList}
          aria-label="Delete current task list"
        >
          Delete TaskList
        </Button>
      </div>

      <Spacer y={4} />
    </div>
  );
};

export default TaskListScreen;
