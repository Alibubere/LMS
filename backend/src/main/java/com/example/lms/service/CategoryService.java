package com.example.lms.service;

import com.example.lms.dto.request.CategoryRequest;
import com.example.lms.dto.response.CategoryResponse;
import com.example.lms.entity.Category;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(CategoryResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryResponse.fromEntity(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new ResourceConflictException("Category with name '" + request.getName() + "' already exists");
        }
        Category category = new Category(null, request.getName().trim(), request.getDescription());
        Category saved = categoryRepository.save(category);
        return CategoryResponse.fromEntity(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getName().equalsIgnoreCase(request.getName().trim()) && categoryRepository.existsByName(request.getName().trim())) {
            throw new ResourceConflictException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
