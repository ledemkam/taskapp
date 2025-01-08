package kte.fullstack.backend.mappers;

import kte.fullstack.backend.model.dto.TaskDTO;
import kte.fullstack.backend.model.entity.Task;

public interface TaskMapper {
    Task fromDTO(TaskDTO dto);
    TaskDTO toDTO(Task task);
}
