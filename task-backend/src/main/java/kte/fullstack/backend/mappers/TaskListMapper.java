package kte.fullstack.backend.mappers;

import kte.fullstack.backend.model.dto.TaskListDTO;
import kte.fullstack.backend.model.entity.TaskList;

public interface TaskListMapper {
     TaskList fromDTO(TaskListDTO dto);
     TaskListDTO toDTO(TaskList taskList);
}

