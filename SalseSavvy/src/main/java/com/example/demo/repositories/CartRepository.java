package com.example.demo.repositories;

import com.example.demo.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Integer> {

    @Query("SELECT c FROM CartItem c " +
           "JOIN FETCH c.product p " +
           "WHERE c.user.userId = :userId")
    List<CartItem> findCartItemsWithProductDetails(@Param("userId") int userId);

    Optional<CartItem> findByUser_UserIdAndProduct_ProductId(int userId, int productId);

}