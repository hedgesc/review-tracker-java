CREATE TABLE items (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    owner VARCHAR(320) NOT NULL,
    review_frequency INT NOT NULL,
    created_at_utc DATETIME(6) NOT NULL,
    last_reviewed_at_utc DATETIME(6) NULL,
    next_review_due_at_utc DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_items_next_review_due_at_utc (next_review_due_at_utc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reviews (
    id INT NOT NULL AUTO_INCREMENT,
    item_id INT NOT NULL,
    reviewer_email VARCHAR(320) NOT NULL,
    reviewed_at_utc DATETIME(6) NOT NULL,
    note VARCHAR(2000) NULL,
    PRIMARY KEY (id),
    INDEX idx_reviews_reviewed_at_utc (reviewed_at_utc),
    CONSTRAINT fk_reviews_item
        FOREIGN KEY (item_id) REFERENCES items (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
