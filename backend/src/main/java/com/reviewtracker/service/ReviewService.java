package com.reviewtracker.service;

import com.reviewtracker.domain.Review;
import com.reviewtracker.dto.AuditReviewResponse;
import com.reviewtracker.repository.OffsetBasedPageRequest;
import com.reviewtracker.repository.ReviewRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<AuditReviewResponse> listReviews(
            Integer itemId, Instant from, Instant to, int skip, int take) {
        int safeSkip = Math.max(skip, 0);
        int safeTake = take <= 0 ? 100 : take;

        var pageable = new OffsetBasedPageRequest(
                safeSkip,
                safeTake,
                Sort.by(Sort.Direction.DESC, "reviewedAtUtc"));

        return reviewRepository.findFiltered(itemId, from, to, pageable).getContent().stream()
                .map(this::toAuditResponse)
                .toList();
    }

    private AuditReviewResponse toAuditResponse(Review review) {
        return new AuditReviewResponse(
                review.getId(),
                review.getItem().getId(),
                review.getItem().getName(),
                review.getItem().getOwner(),
                review.getReviewerEmail(),
                review.getReviewedAtUtc(),
                review.getNote());
    }
}
