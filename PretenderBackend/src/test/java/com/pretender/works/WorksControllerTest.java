package com.pretender.works;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.util.List;
import java.util.Optional;
import com.pretender.common.exceptions.ApiExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class WorksControllerTest {
    private WorksService works;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        works = mock(WorksService.class);
        mvc = MockMvcBuilders.standaloneSetup(new WorksController(works))
            .setControllerAdvice(new ApiExceptionHandler()).build();
    }

    @Test
    void searchesWorkAndRejectsBlankSearches() throws Exception {
        when(works.search("road")).thenReturn(List.of(new WorkSummary("mock-1", "W-1", "Road", "mock", true)));
        mvc.perform(get("/api/works/search").param("q", "road"))
            .andExpect(status().isOk()).andExpect(jsonPath("$[0].id").value("mock-1"))
            .andExpect(jsonPath("$[0].mock").value(true));
        mvc.perform(get("/api/works/search").param("q", " "))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").exists());
    }

    @Test
    void retrievesByIdAndReturnsAUsefulNotFoundError() throws Exception {
        when(works.findById("mock-1")).thenReturn(Optional.of(new WorkSummary("mock-1", "W-1", "Road", "mock", true)));
        mvc.perform(get("/api/works/mock-1")).andExpect(status().isOk()).andExpect(jsonPath("$.workNumber").value("W-1"));
        mvc.perform(get("/api/works/missing")).andExpect(status().isNotFound()).andExpect(jsonPath("$.error").value("Work missing was not found"));
    }
}
