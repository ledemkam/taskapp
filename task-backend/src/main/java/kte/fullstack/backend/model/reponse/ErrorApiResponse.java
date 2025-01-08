package kte.fullstack.backend.model.reponse;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class ErrorApiResponse {
    private int code;
    private String message;
}
