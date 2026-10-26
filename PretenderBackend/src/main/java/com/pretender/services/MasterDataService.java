package com.pretender.services;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pretender.entities.MasterEntity;
import com.pretender.entities.MasterTenderType;
import com.pretender.entities.MasterNumberOfCovers;
import com.pretender.entities.MasterTenderCategory;
import com.pretender.entities.MasterWorkItemProductCategory;
import com.pretender.entities.MasterNumberOfBidOpeners;
import com.pretender.entities.MasterFormOfContract;
import com.pretender.entities.MasterTendererClass;
import com.pretender.forms.MasterOptionResponse;
import com.pretender.repositories.MasterTenderTypeRepository;
import com.pretender.repositories.MasterNumberOfCoversRepository;
import com.pretender.repositories.MasterTenderCategoryRepository;
import com.pretender.repositories.MasterWorkItemProductCategoryRepository;
import com.pretender.repositories.MasterNumberOfBidOpenersRepository;
import com.pretender.repositories.MasterFormOfContractRepository;
import com.pretender.repositories.MasterTendererClassRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class MasterDataService {
    private final MasterTenderTypeRepository tenderTypes;
    private final MasterNumberOfCoversRepository covers;
    private final MasterTenderCategoryRepository categories;
    private final MasterWorkItemProductCategoryRepository productCategories;
    private final MasterNumberOfBidOpenersRepository bidOpeners;
    private final MasterFormOfContractRepository contracts;
    private final MasterTendererClassRepository tendererClasses;

    public MasterDataService(MasterTenderTypeRepository tenderTypes, MasterNumberOfCoversRepository covers,
        MasterTenderCategoryRepository categories, MasterWorkItemProductCategoryRepository productCategories,
        MasterNumberOfBidOpenersRepository bidOpeners, MasterFormOfContractRepository contracts,
        MasterTendererClassRepository tendererClasses) {
        this.tenderTypes = tenderTypes; this.covers = covers; this.categories = categories;
        this.productCategories = productCategories; this.bidOpeners = bidOpeners; this.contracts = contracts;
        this.tendererClasses = tendererClasses;
    }

    @Transactional(readOnly = true)
    public List<MasterOptionResponse> list(String key) {
        return repository(key).findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
            .map(entity -> response((MasterEntity) entity)).toList();
    }

    public MasterOptionResponse create(String key, String name) {
        MasterEntity option = newEntity(key);
        option.setName(cleanName(name));
        return response(save(repository(key), option));
    }

    public MasterOptionResponse update(String key, long id, String name) {
        JpaRepository<?, Long> repository = repository(key);
        MasterEntity option = find(repository, id);
        option.setName(cleanName(name));
        return response(save(repository, option));
    }

    public void delete(String key, long id) {
        JpaRepository<?, Long> repository = repository(key);
        find(repository, id);
        repository.deleteById(id);
    }

    private MasterEntity newEntity(String key) {
        return switch (key) {
            case "tender-type" -> new MasterTenderType();
            case "number-of-covers" -> new MasterNumberOfCovers();
            case "tender-category" -> new MasterTenderCategory();
            case "work-item-product-category" -> new MasterWorkItemProductCategory();
            case "number-of-bid-openers" -> new MasterNumberOfBidOpeners();
            case "form-of-contract" -> new MasterFormOfContract();
            case "tenderer-class" -> new MasterTendererClass();
            default -> throw new EntityNotFoundException("Unknown master list: " + key);
        };
    }

    private JpaRepository<?, Long> repository(String key) {
        return switch (key) {
            case "tender-type" -> tenderTypes;
            case "number-of-covers" -> covers;
            case "tender-category" -> categories;
            case "work-item-product-category" -> productCategories;
            case "number-of-bid-openers" -> bidOpeners;
            case "form-of-contract" -> contracts;
            case "tenderer-class" -> tendererClasses;
            default -> throw new EntityNotFoundException("Unknown master list: " + key);
        };
    }

    private String cleanName(String value) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException("Name is required");
        String name = value.trim();
        if (name.length() > 120) throw new IllegalArgumentException("Name cannot exceed 120 characters");
        return name;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private MasterEntity find(JpaRepository repository, long id) {
        Object found = repository.findById(id).orElse(null);
        if (found == null) throw new EntityNotFoundException("Master value " + id + " was not found");
        return (MasterEntity) found;
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private MasterEntity save(JpaRepository repository, MasterEntity entity) {
        return (MasterEntity) repository.save(entity);
    }

    private MasterOptionResponse response(MasterEntity entity) {
        return new MasterOptionResponse(entity.getId(), entity.getName());
    }
}