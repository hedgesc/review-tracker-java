package com.reviewtracker.dto;

import java.time.Instant;

public record ReviewResponse(
        Integer id,
        Integer itemId,
        String reviewerEmail,
        Instant reviewedAtUtc,
        String note) {
}
