package com.example.demo.services;

import com.example.demo.entities.CartItem;
import com.example.demo.entities.User;
import com.example.demo.entities.Product;
import com.example.demo.entities.ProductImage;
import com.example.demo.repositories.CartRepository;
import com.example.demo.repositories.ProductImageRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;


    // Get Cart Items for a User
    public Map<String, Object> getCartItems(int userId) {

        // Fetch cart items with product details
        List<CartItem> cartItems = cartRepository.findCartItemsWithProductDetails(userId);

        Map<String, Object> response = new HashMap<>();

        // Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        response.put("username", user.getUsername());
        response.put("role", user.getRole().toString());

        // List to hold product details
        List<Map<String, Object>> products = new ArrayList<>();
        double overallTotalPrice = 0;

        for (CartItem cartItem : cartItems) {

            Map<String, Object> productDetails = new HashMap<>();

            // Get product
            Product product = cartItem.getProduct();

            // Fetch product images
            List<ProductImage> productImages =
                    productImageRepository.findByProduct_ProductId(product.getProductId());

            String imageUrl = (productImages != null && !productImages.isEmpty())
                    ? productImages.get(0).getImageUrl()
                    : "default-image-url";

            // Populate product details
            productDetails.put("product_id", product.getProductId());
            productDetails.put("image_url", imageUrl);
            productDetails.put("name", product.getName());
            productDetails.put("description", product.getDescription());
            productDetails.put("price_per_unit", product.getPrice());
            productDetails.put("quantity", cartItem.getQuantity());

            double totalPrice = cartItem.getQuantity() * product.getPrice().doubleValue();
            productDetails.put("total_price", totalPrice);

            products.add(productDetails);

            overallTotalPrice += totalPrice;
        }

        // Prepare final cart
        Map<String, Object> cart = new HashMap<>();
        cart.put("products", products);
        cart.put("overall_total_price", overallTotalPrice);

        response.put("cart", cart);

        return response;
    }

    // Add a product to the cart (or increase quantity if it's already there)
    public void addToCart(int userId, int productId, int quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        Optional<CartItem> existingItem =
                cartRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartRepository.save(newItem);
        }
    }
}