package kte.fullstack.backend.exeption;

public class TaskListNotFoundException extends NotFoundException {
    public TaskListNotFoundException(String message) {
        super(message);
    }
}
