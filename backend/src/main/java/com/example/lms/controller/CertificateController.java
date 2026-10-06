package com.example.lms.controller;

import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.CertificateResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Certificates", description = "Course completion verification and certificate issuance APIs")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/courses/{courseId}/certificate")
    @Operation(summary = "Get certificate for completed course")
    public ResponseEntity<ApiResponse<CertificateResponse>> getCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CertificateResponse response = certificateService.getCertificate(courseId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/courses/{courseId}/certificate")
    @Operation(summary = "Generate certificate after validating course completion requirements")
    public ResponseEntity<ApiResponse<CertificateResponse>> generateCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        CertificateResponse response = certificateService.generateCertificate(courseId, currentUser);
        return new ResponseEntity<>(ApiResponse.success("Certificate generated successfully", response), HttpStatus.CREATED);
    }
}
