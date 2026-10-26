package com.pretender.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import com.pretender.forms.TenderRequest;
import com.pretender.works.WorkSummary;
import com.pretender.works.WorksService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;

class ParentWorkSelectionServiceTest {
    private final WorksService works = mock(WorksService.class);
    private final ParentWorkSelectionService selection = new ParentWorkSelectionService(works);

    @Test
    void persistsOnlyTheCanonicalWorkDetailsFromTheSelectedStableId() {
        when(works.findById("work-1")).thenReturn(Optional.of(new WorkSummary("work-1", "W-001", "Approved description", "test adapter", false)));
        TenderRequest resolved = selection.resolve(request("work-1", "forged number", "forged description"));
        assertEquals("W-001", resolved.parentWorkNumber());
        assertEquals("Approved description", resolved.parentWorkDescription());
    }

    @Test
    void rejectsUnknownIdsAndUnboundClientSuppliedDetails() {
        when(works.findById("missing")).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> selection.resolve(request("missing", null, null)));
        assertThrows(IllegalArgumentException.class, () -> selection.resolve(request(null, "W-1", null)));
    }

    private TenderRequest request(String id, String number, String description) {
        return new TenderRequest("Open Tender", "REF-1", 1L, 1L, 1L, 1L, 1L, 1L, 90,
            "Cover 1", "Cover 2", 365, 1L, false, false, null, null, false, null,
            null, null, null, null, null, null, null, id, number, description, null, null, null);
    }
}
