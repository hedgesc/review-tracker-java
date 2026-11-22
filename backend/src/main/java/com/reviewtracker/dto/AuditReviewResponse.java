package com.reviewtracker.dto;

import java.time.Instant;

public record AuditReviewResponse(
        Integer id,
        Integer itemId,
        String itemName,
        String owner,
        String reviewerEmail,
        Instant reviewedAtUtc,
        String note) {
}
