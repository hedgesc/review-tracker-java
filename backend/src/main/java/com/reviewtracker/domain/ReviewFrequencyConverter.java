package com.reviewtracker.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ReviewFrequencyConverter implements AttributeConverter<ReviewFrequency, Integer> {

    @Override
    public Integer convertToDatabaseColumn(ReviewFrequency attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public ReviewFrequency convertToEntityAttribute(Integer dbData) {
        return dbData == null ? null : ReviewFrequency.fromValue(dbData);
    }
}
