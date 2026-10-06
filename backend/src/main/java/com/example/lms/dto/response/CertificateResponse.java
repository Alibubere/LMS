package com.example.lms.dto.response;

import com.example.lms.entity.Certificate;
import java.time.LocalDateTime;

public class CertificateResponse {
    private Long id;
    private String certificateCode;
    private Long userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime issueDate;
    private String grade;
    private String certificateUrl;

    public CertificateResponse() {}

    public static CertificateResponse fromEntity(Certificate cert) {
        if (cert == null) return null;
        CertificateResponse res = new CertificateResponse();
        res.setId(cert.getId());
        res.setCertificateCode(cert.getCertificateCode());
        if (cert.getUser() != null) {
            res.setUserId(cert.getUser().getId());
            res.setUserName(cert.getUser().getName());
        }
        if (cert.getCourse() != null) {
            res.setCourseId(cert.getCourse().getId());
            res.setCourseTitle(cert.getCourse().getTitle());
        }
        res.setIssueDate(cert.getIssueDate());
        res.setGrade(cert.getGrade());
        res.setCertificateUrl(cert.getCertificateUrl());
        return res;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
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
