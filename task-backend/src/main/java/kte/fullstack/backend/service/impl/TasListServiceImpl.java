package kte.fullstack.backend.service.impl;

import kte.fullstack.backend.model.entity.TaskList;
import kte.fullstack.backend.repository.TaskListRepository;
import kte.fullstack.backend.service.TaskListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class TasListServiceImpl implements TaskListService {

    private final TaskListRepository taskListRepository;


    @Override
    public List<TaskList> getAllTaskLists() {
        return taskListRepository.findAll();
    }

    @Override
    public TaskList createTaskList(TaskList taskList) {
        if(taskList.getId() != null) {
            throw new IllegalArgumentException("TaskList id must be null");
        }
        if (taskList.getTitle() == null || taskList.getTitle().isBlank()) {
            throw new IllegalArgumentException("TaskList title must not be null or blank");
        }
        LocalDateTime now = LocalDateTime.now();
        return taskListRepository.save(new TaskList(
                null,
                taskList.getTitle(),
                taskList.getDescription(),
                null,
                now,
                now
        ));
    }

    @Override
    public Optional<TaskList> getTaskList(UUID id) {
        return taskListRepository.findById(id);
    }

    @Override
    public TaskList updateTaskList(UUID taskListId,TaskList taskList) {
        if(taskList.getId() == null) {
            throw new IllegalArgumentException("TaskList id must not be null");
        }
        if (!Objects.equals(taskList.getId().toString(), taskListId.toString())) {
            throw new IllegalArgumentException("TaskList id must not be changed");
        }
        TaskList existingTaskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("TaskList not found"));

        existingTaskList.setTitle(taskList.getTitle());
        existingTaskList.setDescription(taskList.getDescription());
        existingTaskList.setUpdated(LocalDateTime.now());

        return taskListRepository.save(existingTaskList);
    }

    @Override
    public  void deleteTaskList(UUID taskListId) {
        taskListRepository.deleteById(taskListId);
    }


}
