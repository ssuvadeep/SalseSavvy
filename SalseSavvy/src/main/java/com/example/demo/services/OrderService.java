package com.example.demo.services;

import com.example.demo.entities.*;
import com.example.demo.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    /**
     * Creates a PENDING Order + OrderItems from the user's current cart,
     * then clears the cart. This is what the frontend calls right before
     * starting the Razorpay checkout.
     */
    @Transactional
    public Order checkout(User user) {

        List<CartItem> cartItems = cartRepository.findCartItemsWithProductDetails(user.getUserId());

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUserId(user.getUserId());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();
            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getProductId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerUnit(product.getPrice());
            orderItem.setTotalPrice(itemTotal);

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(itemTotal);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart now that it's been converted into an order
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    /**
     * Fetches all successful orders for a given user
     */
    public Map<String, Object> getOrdersForUser(User user) {

        List<OrderItem> orderItems =
                orderItemRepository.findSuccessfulOrderItemsByUserId(user.getUserId());

        Map<String, Object> response = new HashMap<>();

        response.put("username", user.getUsername());
        response.put("role", user.getRole());

        List<Map<String, Object>> products = new ArrayList<>();

        for (OrderItem item : orderItems) {

            Product product = productRepository
                    .findById(item.getProductId())
                    .orElse(null);

            if (product == null) {
                continue;
            }

            List<ProductImage> images =
                    productImageRepository.findByProduct_ProductId(product.getProductId());

            String imageUrl = images.isEmpty() ? null : images.get(0).getImageUrl();

            Map<String, Object> productDetails = new HashMap<>();

            productDetails.put("order_id", item.getOrder().getOrderId());
            productDetails.put("quantity", item.getQuantity());
            productDetails.put("total_price", item.getTotalPrice());
            productDetails.put("image_url", imageUrl);
            productDetails.put("product_id", product.getProductId());
            productDetails.put("name", product.getName());
            productDetails.put("description", product.getDescription());
            productDetails.put("price_per_unit", item.getPricePerUnit());

            products.add(productDetails);
        }

        response.put("products", products);

        return response;
    }
}