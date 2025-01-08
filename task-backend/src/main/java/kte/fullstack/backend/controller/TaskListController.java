package kte.fullstack.backend.controller;

import kte.fullstack.backend.model.dto.TaskListDTO;
import kte.fullstack.backend.model.entity.TaskList;
import kte.fullstack.backend.mappers.TaskListMapper;
import kte.fullstack.backend.service.TaskListService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/task-lists")
public class TaskListController {

    final TaskListService taskListService;
    final TaskListMapper taskListMapper;

    @GetMapping
    public List<TaskListDTO> getAllTaskLists() {
        return taskListService.getAllTaskLists()
                .stream()
                .map(taskListMapper::toDTO)
                .toList();
    }

    @PostMapping
    public TaskListDTO createTaskList(@RequestBody TaskListDTO taskListDTO) {
        TaskList createdTaskList = taskListService.createTaskList(
                taskListMapper.fromDTO(taskListDTO)
        );
        return taskListMapper.toDTO(createdTaskList);
    }

    @GetMapping(path = "/{task_list_id}")
    public TaskListDTO getTaskList(@PathVariable("task_list_id") UUID taskListId) {
        return taskListService.getTaskList(taskListId)
                .map(taskListMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("TaskList not found"));
    }


    @PutMapping(path = "/{task_list_id}")
    public TaskListDTO updateTaskList(
            @PathVariable("task_list_id") UUID taskListId,
            @RequestBody TaskListDTO taskListDTO)
    {
        TaskList updatedTaskList = taskListService.updateTaskList(
                taskListId,
                taskListMapper.fromDTO(taskListDTO)
        );
        return taskListMapper.toDTO(updatedTaskList);
    }

    @DeleteMapping(path = "/{task_list_id}")
    public void deleteTaskList(@PathVariable("task_list_id") UUID taskListId) {
        taskListService.deleteTaskList(taskListId);
    }



}
