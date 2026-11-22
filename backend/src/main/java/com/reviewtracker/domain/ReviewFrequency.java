package com.reviewtracker.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReviewFrequency {
    Daily(1),
    Weekly(2),
    Monthly(3),
    Quarterly(4),
    Yearly(5);

    private final int value;

    ReviewFrequency(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    @JsonValue
    public String toJson() {
        return name();
    }

    @JsonCreator
    public static ReviewFrequency fromJson(String value) {
        for (ReviewFrequency frequency : values()) {
            if (frequency.name().equalsIgnoreCase(value)) {
                return frequency;
            }
        }
        throw new IllegalArgumentException("Unknown review frequency: " + value);
    }

    public static ReviewFrequency fromValue(int value) {
        for (ReviewFrequency frequency : values()) {
            if (frequency.value == value) {
                return frequency;
            }
        }
        throw new IllegalArgumentException("Unknown review frequency value: " + value);
    }
}
