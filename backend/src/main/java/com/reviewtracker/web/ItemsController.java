package com.reviewtracker.web;

import com.reviewtracker.dto.CreateItemRequest;
import com.reviewtracker.dto.CreateReviewRequest;
import com.reviewtracker.dto.ItemResponse;
import com.reviewtracker.dto.OverdueItemResponse;
import com.reviewtracker.dto.ReviewResponse;
import com.reviewtracker.service.ItemService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
public class ItemsController {

    private final ItemService itemService;

    public ItemsController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody CreateItemRequest request) {
        ItemResponse created = itemService.createItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/overdue")
    public List<OverdueItemResponse> listOverdue() {
        return itemService.listOverdue();
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable("id") Integer id,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse created = itemService.createReview(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
