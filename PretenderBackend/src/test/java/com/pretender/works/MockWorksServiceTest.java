package com.pretender.works;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class MockWorksServiceTest {
    private final MockWorksService works = new MockWorksService();

    @Test
    void searchesByNumberDescriptionAndStableIdAndMarksEveryResultAsMock() {
        assertEquals(1, works.search("bridge").size());
        assertEquals(1, works.search("1001").size());
        assertEquals(1, works.search("mock-work-1003").size());
        assertTrue(works.search("road").getFirst().mock());
        assertEquals(MockWorksService.SOURCE_LABEL, works.search("road").getFirst().source());
    }

    @Test
    void returnsNoResultForUnknownIdsAndCanRetrieveStableIds() {
        assertTrue(works.findById("not-a-work").isEmpty());
        assertEquals("MOCK-WORK-1004", works.findById("mock-work-1004").orElseThrow().workNumber());
    }
}
