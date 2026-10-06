package com.example.lms.controller;

import com.example.lms.dto.request.LoginRequest;
import com.example.lms.dto.request.RegisterRequest;
import com.example.lms.dto.response.AuthResponse;
import com.example.lms.dto.response.UserResponse;
import com.example.lms.security.CustomUserDetailsService;
import com.example.lms.security.JwtAuthenticationEntryPoint;
import com.example.lms.security.JwtTokenProvider;
import com.example.lms.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    void register_Success() throws Exception {
        RegisterRequest request = new RegisterRequest("Jane Learner", "jane@test.com", "password123", "LEARNER");
        UserResponse userResponse = new UserResponse(1L, "Jane Learner", "jane@test.com", "LEARNER", null, null, null, null);
        AuthResponse authResponse = new AuthResponse("mock.jwt.token", userResponse);

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
            .andExpect(jsonPath("$.data.user.email").value("jane@test.com"));
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest("jane@test.com", "password123");
        UserResponse userResponse = new UserResponse(1L, "Jane Learner", "jane@test.com", "LEARNER", null, null, null, null);
        AuthResponse authResponse = new AuthResponse("mock.jwt.token", userResponse);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").value("mock.jwt.token"));
    }
}
