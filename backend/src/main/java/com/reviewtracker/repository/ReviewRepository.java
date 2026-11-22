package com.reviewtracker.repository;

import com.reviewtracker.domain.Review;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @EntityGraph(attributePaths = "item")
    @Query("""
            SELECT r FROM Review r
            WHERE (:itemId IS NULL OR r.item.id = :itemId)
              AND (:from IS NULL OR r.reviewedAtUtc >= :from)
              AND (:to IS NULL OR r.reviewedAtUtc <= :to)
            """)
    Page<Review> findFiltered(
            @Param("itemId") Integer itemId,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable);
}
