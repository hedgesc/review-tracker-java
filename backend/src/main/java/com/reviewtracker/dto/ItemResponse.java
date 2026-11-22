package com.reviewtracker.dto;

import com.reviewtracker.domain.ReviewFrequency;
import java.time.Instant;

public record ItemResponse(
        Integer id,
        String name,
        String owner,
        ReviewFrequency reviewFrequency,
        Instant createdAtUtc,
        Instant lastReviewedAtUtc,
        Instant nextReviewDueAtUtc) {
}
