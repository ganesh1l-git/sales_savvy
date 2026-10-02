package com.sales.savvy.service;

import com.sales.savvy.dto.ProductRequest;
import com.sales.savvy.dto.ProductResponse;
import com.sales.savvy.entity.Category;
import com.sales.savvy.entity.Product;
import com.sales.savvy.entity.ProductImage;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.exception.ResourceNotFoundException;
import com.sales.savvy.repository.CategoryRepository;
import com.sales.savvy.repository.ProductImageRepository;
import com.sales.savvy.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ProductImageRepository productImageRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(Long categoryId, String search, Pageable pageable) {
        return getProducts(categoryId, null, search, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(Long categoryId, String subCategory, String search, Pageable pageable) {
        Page<Product> productPage;

        boolean hasCategory = categoryId != null && categoryId > 0;
        boolean hasSubCategory = subCategory != null && !subCategory.trim().isEmpty();
        boolean hasSearch = search != null && !search.trim().isEmpty();

        String cleanSearch = hasSearch ? search.trim() : null;
        String cleanSub = hasSubCategory ? subCategory.trim() : null;

        if (hasCategory && hasSubCategory && hasSearch) {
            productPage = productRepository.findByCategoryCategoryIdAndSubCategoryIgnoreCaseAndNameContainingIgnoreCase(categoryId, cleanSub, cleanSearch, pageable);
        } else if (hasCategory && hasSubCategory) {
            productPage = productRepository.findByCategoryCategoryIdAndSubCategoryIgnoreCase(categoryId, cleanSub, pageable);
        } else if (hasSubCategory && hasSearch) {
            productPage = productRepository.findBySubCategoryIgnoreCaseAndNameContainingIgnoreCase(cleanSub, cleanSearch, pageable);
        } else if (hasSubCategory) {
            productPage = productRepository.findBySubCategoryIgnoreCase(cleanSub, pageable);
        } else if (hasCategory && hasSearch) {
            productPage = productRepository.findByCategoryCategoryIdAndNameContainingIgnoreCase(categoryId, cleanSearch, pageable);
        } else if (hasCategory) {
            productPage = productRepository.findByCategoryCategoryId(categoryId, pageable);
        } else if (hasSearch) {
            productPage = productRepository.findByNameContainingIgnoreCase(cleanSearch, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        return productPage.map(ProductResponse::new);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(Long categoryId, String search) {
        return getAllProducts(categoryId, null, search);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(Long categoryId, String subCategory, String search) {
        List<Product> products = productRepository.findAll();

        if (categoryId != null && categoryId > 0) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().getCategoryId().equals(categoryId))
                    .collect(Collectors.toList());
        }

        if (subCategory != null && !subCategory.trim().isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getSubCategory() != null && p.getSubCategory().equalsIgnoreCase(subCategory.trim()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(q)) ||
                                 (p.getDescription() != null && p.getDescription().toLowerCase().contains(q)))
                    .collect(Collectors.toList());
        }

        return products.stream().map(ProductResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return new ProductResponse(product);
    }

    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product(
                request.getName().trim(),
                request.getDescription(),
                request.getPrice(),
                request.getStock(),
                category,
                request.getSubCategory()
        );

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    product.addImage(new ProductImage(product, url.trim()));
                }
            }
        }

        Product saved = productRepository.save(product);
        return new ProductResponse(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setSubCategory(request.getSubCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        // Update images
        product.getImages().clear();
        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    product.addImage(new ProductImage(product, url.trim()));
                }
            }
        }

        Product saved = productRepository.save(product);
        return new ProductResponse(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Product product = getProductEntity(productId);
        if (product.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName() +
                    ". Available: " + product.getStock() + ", Requested: " + quantity);
        }
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }

    @Transactional
    public void restoreStock(Long productId, int quantity) {
        Product product = getProductEntity(productId);
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }
}
