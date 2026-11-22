package com.reviewtracker.dto;

import com.reviewtracker.domain.ReviewFrequency;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateItemRequest(
        @NotBlank @Size(min = 1, max = 200) String name,
        @NotBlank @Email @Size(min = 1, max = 320) String owner,
        @NotNull ReviewFrequency reviewFrequency,
        @NotNull Instant nextReviewDueAtUtc) {
}
