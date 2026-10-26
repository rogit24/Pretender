package com.pretender.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.pretender.entities.MasterFormOfContract;
import com.pretender.entities.MasterNumberOfBidOpeners;
import com.pretender.entities.MasterNumberOfCovers;
import com.pretender.entities.MasterTenderCategory;
import com.pretender.entities.MasterTenderType;
import com.pretender.entities.MasterTendererClass;
import com.pretender.entities.MasterWorkItemProductCategory;
import com.pretender.forms.MasterOptionRequest;
import com.pretender.forms.MasterOptionResponse;
import com.pretender.repositories.MasterFormOfContractRepository;
import com.pretender.repositories.MasterNumberOfBidOpenersRepository;
import com.pretender.repositories.MasterNumberOfCoversRepository;
import com.pretender.repositories.MasterTenderCategoryRepository;
import com.pretender.repositories.MasterTenderTypeRepository;
import com.pretender.repositories.MasterTendererClassRepository;
import com.pretender.repositories.MasterWorkItemProductCategoryRepository;

@ExtendWith(MockitoExtension.class)
class MasterDataServiceTest {
    @Mock private MasterTenderTypeRepository tenderTypes;
    @Mock private MasterNumberOfCoversRepository covers;
    @Mock private MasterTenderCategoryRepository categories;
    @Mock private MasterWorkItemProductCategoryRepository productCategories;
    @Mock private MasterNumberOfBidOpenersRepository bidOpeners;
    @Mock private MasterFormOfContractRepository contracts;
    @Mock private MasterTendererClassRepository tendererClasses;

    private MasterDataService service;

    @BeforeEach
    void setUp() {
        service = new MasterDataService(tenderTypes, covers, categories, productCategories, bidOpeners, contracts, tendererClasses);
    }

    @Test
    void createAllowsRepeatedProductNamesAndPreservesCategoryRelationship() {
        MasterTenderCategory category = new MasterTenderCategory();
        ReflectionTestUtils.setField(category, "id", 42L);
        category.setName("Services");
        when(categories.findById(42L)).thenReturn(Optional.of(category));
        when(productCategories.save(any(MasterWorkItemProductCategory.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        MasterOptionResponse created = service.create("work-item-product-category",
            new MasterOptionRequest("Aids and appliances for the disabled", null, null, null, 42L));

        assertEquals("Aids and appliances for the disabled", created.name());
        assertEquals(42L, created.tenderCategoryId());
        assertEquals("Services", created.tenderCategoryName());
        verify(productCategories).save(any(MasterWorkItemProductCategory.class));
        assertNotNull(created);
    }
}
