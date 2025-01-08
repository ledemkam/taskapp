package kte.fullstack.backend.service.impl;

import kte.fullstack.backend.model.entity.Task;
import kte.fullstack.backend.model.entity.TaskList;
import kte.fullstack.backend.model.entity.TaskPriority;
import kte.fullstack.backend.model.entity.TaskStatus;
import kte.fullstack.backend.repository.TaskListRepository;
import kte.fullstack.backend.repository.TaskRepository;
import kte.fullstack.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class TaskServiceImpl implements TaskService {

    final TaskRepository taskRepository;
    final TaskListRepository taskListRepository;

    @Override
    public List<Task> getListTasks(UUID taskListId) {
        return taskRepository.findAllTaskByTaskListId(taskListId);

    }

    @Override
    public Task createTask(UUID taskListId, Task task) {
        if(task.getId() != null) {
            throw new IllegalArgumentException("TaskController id must be null");
        }
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("TaskController title must not be null or blank");
        }
        TaskPriority priority = Optional.ofNullable(task.getPriority())
                                       .orElse(TaskPriority.MEDIUM);

        TaskList taskList = taskListRepository
                .findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("TaskList not found"));

        LocalDateTime now = LocalDateTime.now();

        return taskRepository.save(new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                TaskStatus.OPEN,
                priority,
                taskList,
                now,
                now
        ));
    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByTaskListIdAndId(taskListId, taskId);

    }

    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {
        if(task.getId() == null) {
            throw new IllegalArgumentException("Task ID must not be null");
        }
        if (!Objects.equals(taskId, task.getId())) {
            throw new IllegalArgumentException("Task IDs do not match");
        }

        if(task.getPriority() == null) {
            throw new IllegalArgumentException("Task priority must not be null");
        }

        if(task.getStatus() == null) {
            throw new IllegalArgumentException("Task status must not be null");
        }


        Task existingTask = taskRepository.findByTaskListIdAndId(taskListId, task.getId())
                .orElseThrow(() -> new IllegalStateException("Task found"));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setUpdated(LocalDateTime.now());

        return taskRepository.save(existingTask);


    }

    @Transactional
    @Override
    public void deleteTask(UUID taskListId, UUID id) {
        taskRepository.deleteByTaskListIdAndId(taskListId, id);
    }

}
