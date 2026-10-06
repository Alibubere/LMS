package com.example.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_lesson_progress", columnNames = {"user_id", "lesson_id"})
})
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "watch_time_seconds", nullable = false)
    private Integer watchTimeSeconds = 0;

    @Column(name = "completion_percentage", nullable = false)
    private Double completionPercentage = 0.0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Progress() {}

    public Progress(Long id, User user, Course course, Lesson lesson, Boolean completed, Integer watchTimeSeconds, Double completionPercentage) {
        this.id = id;
        this.user = user;
        this.course = course;
        this.lesson = lesson;
        this.completed = completed != null ? completed : false;
        this.watchTimeSeconds = watchTimeSeconds != null ? watchTimeSeconds : 0;
        this.completionPercentage = completionPercentage != null ? completionPercentage : 0.0;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Integer getWatchTimeSeconds() {
        return watchTimeSeconds;
    }

    public void setWatchTimeSeconds(Integer watchTimeSeconds) {
        this.watchTimeSeconds = watchTimeSeconds;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
