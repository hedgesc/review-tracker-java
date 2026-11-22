package com.reviewtracker.dto;

import com.reviewtracker.domain.ReviewFrequency;
import java.time.Instant;

public record OverdueItemResponse(
        Integer id,
        String name,
        String owner,
        ReviewFrequency reviewFrequency,
        Instant lastReviewedAtUtc,
        Instant nextReviewDueAtUtc) {
}
