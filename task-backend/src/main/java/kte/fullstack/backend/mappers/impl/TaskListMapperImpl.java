package kte.fullstack.backend.mappers.impl;

import kte.fullstack.backend.model.dto.TaskListDTO;
import kte.fullstack.backend.model.entity.Task;
import kte.fullstack.backend.model.entity.TaskList;
import kte.fullstack.backend.model.entity.TaskStatus;
import kte.fullstack.backend.mappers.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import kte.fullstack.backend.mappers.TaskListMapper;

import java.util.List;
import java.util.Optional;


@RequiredArgsConstructor
@Component
public class TaskListMapperImpl implements TaskListMapper {

    private final TaskMapper taskMapper;



    @Override
    public TaskList fromDTO(TaskListDTO dto) {
        return new TaskList(
                dto.id(),
                dto.title(),
                dto.description(),
                Optional.ofNullable(dto.tasks())
                        .map(tasks -> tasks.stream()
                                .map(taskMapper::fromDTO)
                                .toList())
                        .orElse(null),
                null,
                null
        );
    }


    @Override
    public TaskListDTO toDTO(TaskList taskList) {
        final List<Task> tasks = taskList.getTasks();
        return new TaskListDTO(
                taskList.getId(),
                taskList.getTitle(),
                taskList.getDescription(),
                Optional.ofNullable(tasks)
                        .map(List::size)
                        .orElse(0),
                calculateTaskListProgress(tasks),
                Optional.ofNullable(tasks)
                        .map(taskListTasks -> taskListTasks.stream()
                                .map(taskMapper::toDTO)
                                .toList())
                        .orElse(null)

        );
    }


    private Double calculateTaskListProgress(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }
        long closedTaskCount =  tasks.stream()
                .filter(task -> TaskStatus.CLOSED.equals(task.getStatus()))
                .count();
        return (double) closedTaskCount / tasks.size();
    }
}
