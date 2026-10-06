package com.example.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DiscussionReplyRequest {

    @NotBlank(message = "Reply content cannot be empty")
    private String content;

    public DiscussionReplyRequest() {}

    public DiscussionReplyRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
