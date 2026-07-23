package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entities.JWTToken;

import jakarta.transaction.Transactional;

public interface JWTTokenRepository extends JpaRepository<JWTToken, Integer> {

    // Custom query to find token by user ID
    @Query("SELECT t FROM JWTToken t WHERE t.user.userId = :userId")
    JWTToken findByUserId(@Param("userId") int userId);

    // Custom query to delete token by user ID
    @Modifying
    @Transactional
    @Query("DELETE FROM JWTToken t WHERE t.user.userId = :userId")
    void deleteByUserId(@Param("userId") int userId);

}
