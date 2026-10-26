package com.pretender.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.LocalDateTime;
import com.pretender.forms.TenderRequest;
import com.pretender.repositories.*;
import org.junit.jupiter.api.Test;

class TenderServiceValidationTest {
    @Test
    void rejectsInvalidDateRangesBeforeAnyPersistenceOrMasterLookups() {
        TenderRepository tenders = mock(TenderRepository.class);
        MasterTenderTypeRepository tenderTypes = mock(MasterTenderTypeRepository.class);
        MasterNumberOfCoversRepository covers = mock(MasterNumberOfCoversRepository.class);
        MasterTenderCategoryRepository categories = mock(MasterTenderCategoryRepository.class);
        MasterWorkItemProductCategoryRepository products = mock(MasterWorkItemProductCategoryRepository.class);
        MasterNumberOfBidOpenersRepository openers = mock(MasterNumberOfBidOpenersRepository.class);
        MasterFormOfContractRepository contracts = mock(MasterFormOfContractRepository.class);
        MasterTendererClassRepository classes = mock(MasterTendererClassRepository.class);
        TenderService service = new TenderService(tenders, tenderTypes, covers, categories, products, openers, contracts, classes);

        assertThrows(IllegalArgumentException.class, () -> service.create(request(true)));
        assertThrows(IllegalArgumentException.class, () -> service.update(42L, request(false)));
        verifyNoInteractions(tenders, tenderTypes, covers, categories, products, openers, contracts, classes);
    }

    private TenderRequest request(boolean invalidClarification) {
        LocalDateTime start = LocalDateTime.of(2026, 2, 10, 9, 0);
        LocalDateTime clarificationEnd = invalidClarification ? start.minusDays(1) : start;
        LocalDateTime bidStart = start.plusDays(1);
        LocalDateTime bidEnd = invalidClarification ? bidStart : bidStart.minusDays(1);
        return new TenderRequest("Open Tender", "REF-1", 1L, 1L, 1L, 1L, 1L, 1L, 90,
            "Cover 1", "Cover 2", 365, 1L, false, false, null, null, false, null,
            start, start, start, clarificationEnd, bidStart, bidEnd, bidStart.plusDays(1), null, null, null,
            null, null, null);
    }
}
