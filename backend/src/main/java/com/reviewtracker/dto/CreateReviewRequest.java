package com.reviewtracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateReviewRequest(
        @NotBlank @Email @Size(min = 1, max = 320) String reviewerEmail,
        @Size(max = 2000) String note) {
}
