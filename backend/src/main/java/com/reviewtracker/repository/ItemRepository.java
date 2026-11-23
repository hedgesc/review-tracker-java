package com.reviewtracker.repository;

import com.reviewtracker.domain.Item;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    Page<Item> findByNextReviewDueAtUtcBefore(Instant cutoff, Pageable pageable);
}
