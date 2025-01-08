package kte.fullstack.backend.model.dto;

import kte.fullstack.backend.model.entity.TaskPriority;
import kte.fullstack.backend.model.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDTO(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskStatus status,
        TaskPriority priority
) {
}
