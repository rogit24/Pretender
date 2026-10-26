package com.pretender.controllers;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.pretender.forms.MasterOptionRequest;
import com.pretender.forms.MasterOptionResponse;
import com.pretender.services.MasterDataService;

class MasterDataControllerTest {
    @Mock private MasterDataService masters;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mvc = MockMvcBuilders.standaloneSetup(new MasterDataController(masters)).build();
    }

    @Test
    void listReturnsMasterCodeDescriptionAndCategoryRelationship() throws Exception {
        when(masters.list("work-item-product-category")).thenReturn(List.of(
            new MasterOptionResponse(8L, "Civil Works - Roads", null, null, null, 3L, "Works", "demo:product:8")));

        mvc.perform(get("/api/masters/work-item-product-category"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Civil Works - Roads"))
            .andExpect(jsonPath("$[0].tenderCategoryId").value(3))
            .andExpect(jsonPath("$[0].tenderCategoryName").value("Works"))
            .andExpect(jsonPath("$[0].sourceRowKey").value("demo:product:8"));
    }

    @Test
    void createAcceptsWorkbookFieldsWithoutChangingExistingRouteConvention() throws Exception {
        when(masters.create(eq("tender-type"), org.mockito.ArgumentMatchers.any(MasterOptionRequest.class)))
            .thenReturn(new MasterOptionResponse(11L, "Single Tender", "Single", "Single Tender", null, null, null, "demo:type:2"));

        mvc.perform(post("/api/masters/tender-type").contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"code":"Single","description":"Single Tender","name":"","bovalue":null,"tenderCategoryId":null}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value("Single"))
            .andExpect(jsonPath("$.description").value("Single Tender"));

        verify(masters).create(eq("tender-type"), org.mockito.ArgumentMatchers.any(MasterOptionRequest.class));
    }
}
