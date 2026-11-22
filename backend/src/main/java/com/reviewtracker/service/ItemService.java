package com.reviewtracker.service;

import com.reviewtracker.domain.Item;
import com.reviewtracker.domain.Review;
import com.reviewtracker.domain.ReviewFrequency;
import com.reviewtracker.dto.CreateItemRequest;
import com.reviewtracker.dto.CreateReviewRequest;
import com.reviewtracker.dto.ItemResponse;
import com.reviewtracker.dto.OverdueItemResponse;
import com.reviewtracker.dto.ReviewResponse;
import com.reviewtracker.repository.ItemRepository;
import com.reviewtracker.repository.ReviewRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ReviewRepository reviewRepository;

    public ItemService(ItemRepository itemRepository, ReviewRepository reviewRepository) {
        this.itemRepository = itemRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public ItemResponse createItem(CreateItemRequest request) {
        Instant now = Instant.now();
        Item item = new Item();
        item.setName(request.name());
        item.setOwner(request.owner());
        item.setReviewFrequency(request.reviewFrequency());
        item.setCreatedAtUtc(now);
        item.setNextReviewDueAtUtc(request.nextReviewDueAtUtc());
        Item saved = itemRepository.save(item);
        return toItemResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OverdueItemResponse> listOverdue() {
        Instant now = Instant.now();
        return itemRepository.findByNextReviewDueAtUtcBeforeOrderByNextReviewDueAtUtcAsc(now).stream()
                .map(this::toOverdueItemResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse createReview(Integer itemId, CreateReviewRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        Instant reviewedAt = Instant.now();

        Review review = new Review();
        review.setItem(item);
        review.setReviewerEmail(request.reviewerEmail());
        review.setReviewedAtUtc(reviewedAt);
        review.setNote(request.note());

        item.setLastReviewedAtUtc(reviewedAt);
        item.setNextReviewDueAtUtc(advanceDueDate(reviewedAt, item.getReviewFrequency()));

        Review saved = reviewRepository.save(review);
        itemRepository.save(item);

        return new ReviewResponse(
                saved.getId(),
                item.getId(),
                saved.getReviewerEmail(),
                saved.getReviewedAtUtc(),
                saved.getNote());
    }

    static Instant advanceDueDate(Instant from, ReviewFrequency frequency) {
        ZonedDateTime base = from.atZone(ZoneOffset.UTC);
        ZonedDateTime next = switch (frequency) {
            case Daily -> base.plusDays(1);
            case Weekly -> base.plusWeeks(1);
            case Monthly -> base.plusMonths(1);
            case Quarterly -> base.plusMonths(3);
            case Yearly -> base.plusYears(1);
        };
        return next.toInstant();
    }

    private ItemResponse toItemResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getOwner(),
                item.getReviewFrequency(),
                item.getCreatedAtUtc(),
                item.getLastReviewedAtUtc(),
                item.getNextReviewDueAtUtc());
    }

    private OverdueItemResponse toOverdueItemResponse(Item item) {
        return new OverdueItemResponse(
                item.getId(),
                item.getName(),
                item.getOwner(),
                item.getReviewFrequency(),
                item.getLastReviewedAtUtc(),
                item.getNextReviewDueAtUtc());
    }
}
