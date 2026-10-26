package com.pretender.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import com.pretender.entities.*;
import com.pretender.forms.TenderRequest;
import com.pretender.repositories.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.data.domain.Sort;

class TenderPersistenceTest {
    private TenderRepository tenders;
    private MasterTenderTypeRepository types;
    private MasterNumberOfCoversRepository covers;
    private MasterTenderCategoryRepository categories;
    private MasterWorkItemProductCategoryRepository products;
    private MasterNumberOfBidOpenersRepository openers;
    private MasterFormOfContractRepository contracts;
    private MasterTendererClassRepository classes;
    private TenderService service;

    @BeforeEach
    void setUp() {
        tenders = mock(TenderRepository.class); types = mock(MasterTenderTypeRepository.class);
        covers = mock(MasterNumberOfCoversRepository.class); categories = mock(MasterTenderCategoryRepository.class);
        products = mock(MasterWorkItemProductCategoryRepository.class); openers = mock(MasterNumberOfBidOpenersRepository.class);
        contracts = mock(MasterFormOfContractRepository.class); classes = mock(MasterTendererClassRepository.class);
        service = new TenderService(tenders, types, covers, categories, products, openers, contracts, classes);
        MasterTenderType type = named(new MasterTenderType(), 1L, "Open");
        MasterNumberOfCovers cover = named(new MasterNumberOfCovers(), 2L, "Two");
        MasterTenderCategory category = named(new MasterTenderCategory(), 3L, "Works");
        MasterWorkItemProductCategory product = named(new MasterWorkItemProductCategory(), 4L, "Roads");
        product.setTenderCategory(category);
        MasterNumberOfBidOpeners opener = named(new MasterNumberOfBidOpeners(), 5L, "Two Openers");
        MasterFormOfContract contract = named(new MasterFormOfContract(), 6L, "Percentage");
        MasterTendererClass tendererClass = named(new MasterTendererClass(), 7L, "A");
        when(types.findById(1L)).thenReturn(Optional.of(type)); when(covers.findById(2L)).thenReturn(Optional.of(cover));
        when(categories.findById(3L)).thenReturn(Optional.of(category)); when(products.findById(4L)).thenReturn(Optional.of(product));
        when(openers.findById(5L)).thenReturn(Optional.of(opener)); when(contracts.findById(6L)).thenReturn(Optional.of(contract));
        when(classes.findById(7L)).thenReturn(Optional.of(tendererClass));
    }

    @Test
    void createsListsAndUpdatesTheExistingRecordWithoutChangingItsId() {
        when(tenders.save(any(Tender.class))).thenAnswer(call -> {
            Tender saved = call.getArgument(0);
            if (saved.id == null) saved.id = 91L;
            return saved;
        });
        var created = service.create(request("REF-A", "mock-work-1001", "MOCK-WORK-1001"));
        assertEquals(91L, created.id()); assertEquals("mock-work-1001", created.parentWorkId());

        Tender existing = new Tender(); existing.id = 91L;
        when(tenders.findById(91L)).thenReturn(Optional.of(existing));
        var updated = service.update(91L, request("REF-B", null, null));
        assertEquals(91L, updated.id()); assertEquals("REF-B", updated.tenderReferenceNumber());
        assertNull(updated.parentWorkId());
        when(tenders.findAll(any(Sort.class))).thenReturn(List.of(existing));
        assertEquals("REF-B", service.list().getFirst().tenderReferenceNumber());
        verify(tenders, times(2)).save(any(Tender.class));
    }

    private TenderRequest request(String ref, String workId, String workNumber) {
        LocalDateTime date = LocalDateTime.of(2026, 3, 1, 10, 0);
        return new TenderRequest("Open Tender", ref, 1L, 2L, 3L, 4L, 5L, 6L, 90, "Cover 1", null,
            365, 7L, false, false, null, null, false, null, date, date, date, date, date, date, date,
            workId, workNumber, workId == null ? null : "Mock work description", null, null, null);
    }

    private <T extends MasterEntity> T named(T entity, long id, String name) {
        ReflectionTestUtils.setField(entity, "id", id); entity.setName(name); return entity;
    }
}
