package com.example.lms.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private ErrorDetail error;

    public ErrorResponse() {}

    public ErrorResponse(String code, String message) {
        this.error = new ErrorDetail(code, message, null);
    }

    public ErrorResponse(String code, String message, List<String> details) {
        this.error = new ErrorDetail(code, message, details);
    }

    public ErrorDetail getError() {
        return error;
    }

    public void setError(ErrorDetail error) {
        this.error = error;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorDetail {
        private String code;
        private String message;
        private List<String> details;

        public ErrorDetail() {}

        public ErrorDetail(String code, String message, List<String> details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<String> getDetails() {
            return details;
        }

        public void setDetails(List<String> details) {
            this.details = details;
        }
    }
}
