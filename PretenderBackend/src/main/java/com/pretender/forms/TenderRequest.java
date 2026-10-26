package com.pretender.forms;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record TenderRequest(
    @NotBlank @Size(max = 80) String procurementType,
    @NotBlank @Size(max = 180) String tenderReferenceNumber,
    @NotNull Long tenderTypeId,
    @NotNull Long numberOfCoversId,
    @NotNull Long tenderCategoryId,
    @NotNull Long workItemProductCategoryId,
    @NotNull Long numberOfBidOpenersId,
    @NotNull Long formOfContractId,
    @NotNull @Positive Integer bidValidityDays,
    @NotBlank String cover1Description,
    String cover2Description,
    @NotNull @Positive Integer deliveryPeriodDays,
    @NotNull Long tendererClassId,
    @NotNull Boolean emdExemption,
    @NotNull Boolean paperCostExemption,
    @PositiveOrZero BigDecimal tenderFee,
    @PositiveOrZero BigDecimal tenderEmdFee,
    @NotNull Boolean preBidMeeting,
    String preBidMeetingAddress,
    @NotNull LocalDateTime tenderPublishingDateTime,
    @NotNull LocalDateTime documentDownloadStartDateTime,
    @NotNull LocalDateTime seekClarificationStartDateTime,
    @NotNull LocalDateTime seekClarificationEndDateTime,
    @NotNull LocalDateTime bidSubmissionStartDateTime,
    @NotNull LocalDateTime bidSubmissionEndDateTime,
    @NotNull LocalDateTime bidOpeningDateTime,
    String nitFileName,
    String dtcnFileName,
    String otherFileName
) {}