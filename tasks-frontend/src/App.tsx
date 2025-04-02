import "./App.css";
import { Routes, Route } from "react-router-dom";
import TaskLists from "./pages/TaskListsScreen";
import CreateUpdateTaskListScreen from "./pages/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./pages/CreateUpdateTaskScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TaskLists />} />
        <Route path="/new-task-list" element={<CreateUpdateTaskListScreen />} />
        <Route
          path="/edit-task-list/:listId"
          element={<CreateUpdateTaskListScreen />}
        />
        <Route path="/task-lists/:listId" element={<TaskListScreen />} />
        <Route
          path="/task-lists/:listId/new-task"
          element={<CreateUpdateTaskScreen />}
        />
        <Route
          path="/task-lists/:listId/edit-task/:taskId"
          element={<CreateUpdateTaskScreen />}
        />
      </Routes>
    </>
  );
}

export default App;
