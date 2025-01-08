package kte.fullstack.backend.exeption;

public class TaskNotFoundException extends  NotFoundException {
    public TaskNotFoundException(String message) {
        super(message);
    }
}
