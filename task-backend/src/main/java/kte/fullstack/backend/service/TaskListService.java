package kte.fullstack.backend.service;


import kte.fullstack.backend.model.entity.TaskList;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskListService {
    List<TaskList> getAllTaskLists();
    TaskList createTaskList(TaskList taskList);
    Optional<TaskList> getTaskList(UUID id);
    TaskList updateTaskList(UUID tasklist,TaskList taskList);
    void deleteTaskList(UUID taskListId);

}
