package kte.fullstack.backend.exeption;

public class TaskBadRequestException extends RuntimeException {

    public TaskBadRequestException(String attribute, String error) {
        super(attribute + ": " + error);
    }
}
