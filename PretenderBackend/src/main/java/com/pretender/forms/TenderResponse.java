package com.pretender.forms;

import java.time.LocalDateTime;

public record TenderResponse(Long id, String tenderReferenceNumber, String procurementType,
    String tenderType, String tenderCategory, LocalDateTime tenderPublishingDateTime,
    String nitFileName, String dtcnFileName, String otherFileName) {}