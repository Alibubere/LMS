package com.example.lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_course_certificate", columnNames = {"user_id", "course_id"})
})
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_code", nullable = false, unique = true, length = 64)
    private String certificateCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "issue_date", nullable = false, updatable = false)
    private LocalDateTime issueDate;

    @Column(length = 50)
    private String grade = "PASS";

    @Column(name = "certificate_url", length = 512)
    private String certificateUrl;

    @PrePersist
    protected void onCreate() {
        this.issueDate = LocalDateTime.now();
    }

    public Certificate() {}

    public Certificate(Long id, String certificateCode, User user, Course course, String grade, String certificateUrl) {
        this.id = id;
        this.certificateCode = certificateCode;
        this.user = user;
        this.course = course;
        this.grade = grade != null ? grade : "PASS";
        this.certificateUrl = certificateUrl;
        this.issueDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
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

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }
}
