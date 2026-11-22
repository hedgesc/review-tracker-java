package com.reviewtracker.repository;

import com.reviewtracker.domain.Item;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    List<Item> findByNextReviewDueAtUtcBeforeOrderByNextReviewDueAtUtcAsc(Instant cutoff);
}
