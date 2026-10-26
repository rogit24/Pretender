package com.pretender.forms;

import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

class TenderRequestValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsNegativeFeesAndValuesBeyondThePersistedNumericPrecision() {
        assertTrue(validator.validate(request(new BigDecimal("-0.01"), null)).stream()
            .anyMatch(error -> error.getPropertyPath().toString().equals("tenderFee")));
        assertTrue(validator.validate(request(null, new BigDecimal("1000000000000.00"))).stream()
            .anyMatch(error -> error.getPropertyPath().toString().equals("tenderEmdFee")));
    }

    private TenderRequest request(BigDecimal fee, BigDecimal emd) {
        LocalDateTime date = LocalDateTime.of(2026, 1, 1, 10, 0);
        return new TenderRequest("Open Tender", "REF-1", 1L, 1L, 1L, 1L, 1L, 1L, 90,
            "Cover 1", null, 365, 1L, false, false, fee, emd, false, null,
            date, date, date, date, date, date, date, null, null, null, null, null, null);
    }
}
