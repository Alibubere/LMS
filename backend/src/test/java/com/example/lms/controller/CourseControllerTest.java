package com.example.lms.controller;

import com.example.lms.dto.response.CourseResponse;
import com.example.lms.security.CustomUserDetailsService;
import com.example.lms.security.JwtAuthenticationEntryPoint;
import com.example.lms.security.JwtTokenProvider;
import com.example.lms.service.CourseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CourseController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService courseService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    void getAllCourses_Success() throws Exception {
        CourseResponse response = new CourseResponse();
        response.setId(1L);
        response.setTitle("Spring Boot Masterclass");
        response.setStatus("PUBLISHED");

        when(courseService.getAllCourses(any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/api/v1/courses")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data[0].title").value("Spring Boot Masterclass"));
    }

    @Test
    void getCourseById_Success() throws Exception {
        CourseResponse response = new CourseResponse();
        response.setId(1L);
        response.setTitle("Spring Boot Masterclass");

        when(courseService.getCourseById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/courses/1")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").value(1))
            .andExpect(jsonPath("$.data.title").value("Spring Boot Masterclass"));
    }
}
