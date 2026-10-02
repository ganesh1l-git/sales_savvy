package com.sales.savvy.service;

import com.sales.savvy.dto.CategoryDTO;
import com.sales.savvy.entity.Category;
import com.sales.savvy.exception.DuplicateResourceException;
import com.sales.savvy.exception.ResourceNotFoundException;
import com.sales.savvy.repository.CategoryRepository;
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

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::new)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return new CategoryDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByCategoryName(dto.getCategoryName().trim())) {
            throw new DuplicateResourceException("Category name already exists: " + dto.getCategoryName());
        }
        Category category = new Category(dto.getCategoryName().trim());
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String newName = dto.getCategoryName().trim();
        if (!category.getCategoryName().equalsIgnoreCase(newName) && categoryRepository.existsByCategoryName(newName)) {
            throw new DuplicateResourceException("Category name already exists: " + newName);
        }

        category.setCategoryName(newName);
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }
}
