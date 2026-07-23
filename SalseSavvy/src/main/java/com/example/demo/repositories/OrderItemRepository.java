package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entities.Order;
import com.example.demo.entities.OrderItem;

public interface OrderItemRepository extends  JpaRepository<OrderItem, Integer> {
    @Query("SELECT oi FROM OrderItem oi WHERE oi.orderId = :orderId")
    List<OrderItem> findByOrderId(String orderId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.userId = :userId AND oi.status = 'SUCCESS'")
    List<OrderItem> findSuccessfulOrderItemsByUserId(int userId);
}
