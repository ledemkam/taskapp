package kte.fullstack.backend.controller;

import kte.fullstack.backend.mappers.TaskMapper;
import kte.fullstack.backend.model.dto.TaskDTO;
import kte.fullstack.backend.model.entity.Task;
import kte.fullstack.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/task-lists/{task_list_id}/tasks")
public class TaskController {

    final TaskService taskService;
    final TaskMapper taskMapper;

    @GetMapping
    public List<TaskDTO> getAllTasks(@PathVariable("task_list_id") UUID taskListId) {
        return taskService.getListTasks(taskListId)
                .stream()
                .map(taskMapper::toDTO)
                .toList();
    }

    @PostMapping
    public TaskDTO createTask(@PathVariable("task_list_id") UUID taskListId, @RequestBody TaskDTO taskDTO) {
        return taskMapper.toDTO(
                taskService.createTask(
                        taskListId,
                        taskMapper.fromDTO(taskDTO)
                )
        );
    }

    @GetMapping("/{task_id}")
    public Optional<TaskDTO> getTask(@PathVariable("task_list_id") UUID taskListId, @PathVariable("task_id") UUID taskId) {
        return taskService.getTask(taskListId, taskId)
                .map(taskMapper::toDTO);
    }

    @PutMapping("/{task_id}")
    public TaskDTO updateTask(@PathVariable("task_list_id") UUID taskListId,
                              @PathVariable("task_id") UUID id,
                              @RequestBody TaskDTO taskDTO) {
        Task updatedTask = taskService.updateTask(
                taskListId,
                id,
                taskMapper.fromDTO(taskDTO)
        );
        return taskMapper.toDTO(updatedTask);
    }

    @DeleteMapping("/{task_id}")
    public void deleteTask(@PathVariable("task_list_id") UUID taskListId, @PathVariable("task_id") UUID taskId) {
        taskService.deleteTask(taskListId, taskId);
    }
}
