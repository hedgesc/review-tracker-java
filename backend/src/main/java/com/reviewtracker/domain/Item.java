package com.reviewtracker.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 320)
    private String owner;

    @Column(name = "review_frequency", nullable = false)
    private ReviewFrequency reviewFrequency;

    @Column(name = "created_at_utc", nullable = false)
    private Instant createdAtUtc;

    @Column(name = "last_reviewed_at_utc")
    private Instant lastReviewedAtUtc;

    @Column(name = "next_review_due_at_utc", nullable = false)
    private Instant nextReviewDueAtUtc;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public ReviewFrequency getReviewFrequency() {
        return reviewFrequency;
    }

    public void setReviewFrequency(ReviewFrequency reviewFrequency) {
        this.reviewFrequency = reviewFrequency;
    }

    public Instant getCreatedAtUtc() {
        return createdAtUtc;
    }

    public void setCreatedAtUtc(Instant createdAtUtc) {
        this.createdAtUtc = createdAtUtc;
    }

    public Instant getLastReviewedAtUtc() {
        return lastReviewedAtUtc;
    }

    public void setLastReviewedAtUtc(Instant lastReviewedAtUtc) {
        this.lastReviewedAtUtc = lastReviewedAtUtc;
    }

    public Instant getNextReviewDueAtUtc() {
        return nextReviewDueAtUtc;
    }

    public void setNextReviewDueAtUtc(Instant nextReviewDueAtUtc) {
        this.nextReviewDueAtUtc = nextReviewDueAtUtc;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
