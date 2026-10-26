package com.pretender.services;

import java.util.List;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pretender.entities.Tender;
import com.pretender.forms.TenderRequest;
import com.pretender.forms.TenderResponse;
import com.pretender.repositories.TenderRepository;
import com.pretender.repositories.MasterTenderTypeRepository;
import com.pretender.repositories.MasterNumberOfCoversRepository;
import com.pretender.repositories.MasterTenderCategoryRepository;
import com.pretender.repositories.MasterWorkItemProductCategoryRepository;
import com.pretender.repositories.MasterNumberOfBidOpenersRepository;
import com.pretender.repositories.MasterFormOfContractRepository;
import com.pretender.repositories.MasterTendererClassRepository;

@Service
@Transactional
public class TenderService {
    private final TenderRepository tenders;
    private final MasterTenderTypeRepository tenderTypes;
    private final MasterNumberOfCoversRepository covers;
    private final MasterTenderCategoryRepository categories;
    private final MasterWorkItemProductCategoryRepository productCategories;
    private final MasterNumberOfBidOpenersRepository bidOpeners;
    private final MasterFormOfContractRepository contracts;
    private final MasterTendererClassRepository tendererClasses;

    public TenderService(TenderRepository tenders, MasterTenderTypeRepository tenderTypes,
        MasterNumberOfCoversRepository covers, MasterTenderCategoryRepository categories,
        MasterWorkItemProductCategoryRepository productCategories, MasterNumberOfBidOpenersRepository bidOpeners,
        MasterFormOfContractRepository contracts, MasterTendererClassRepository tendererClasses) {
        this.tenders = tenders; this.tenderTypes = tenderTypes; this.covers = covers; this.categories = categories;
        this.productCategories = productCategories; this.bidOpeners = bidOpeners; this.contracts = contracts;
        this.tendererClasses = tendererClasses;
    }

    public TenderResponse create(TenderRequest request) {
        if (request.seekClarificationEndDateTime().isBefore(request.seekClarificationStartDateTime()))
            throw new IllegalArgumentException("Clarification end must be after clarification start");
        if (request.bidSubmissionEndDateTime().isBefore(request.bidSubmissionStartDateTime()))
            throw new IllegalArgumentException("Bid submission end must be after bid submission start");

        Tender tender = new Tender();
        tender.procurementType = request.procurementType().trim();
        tender.tenderReferenceNumber = request.tenderReferenceNumber().trim();
        tender.tenderType = tenderTypes.findById(request.tenderTypeId()).orElseThrow(() -> missing("Tender Type"));
        tender.numberOfCovers = covers.findById(request.numberOfCoversId()).orElseThrow(() -> missing("Number of Covers"));
        tender.tenderCategory = categories.findById(request.tenderCategoryId()).orElseThrow(() -> missing("Tender Category"));
        tender.workItemProductCategory = productCategories.findById(request.workItemProductCategoryId()).orElseThrow(() -> missing("Work Item Product Category"));
        tender.numberOfBidOpeners = bidOpeners.findById(request.numberOfBidOpenersId()).orElseThrow(() -> missing("Number of Bid Openers"));
        tender.formOfContract = contracts.findById(request.formOfContractId()).orElseThrow(() -> missing("Form of Contract"));
        tender.tendererClass = tendererClasses.findById(request.tendererClassId()).orElseThrow(() -> missing("Tenderer Class"));
        tender.bidValidityDays = request.bidValidityDays(); tender.cover1Description = request.cover1Description().trim();
        tender.cover2Description = request.cover2Description(); tender.deliveryPeriodDays = request.deliveryPeriodDays();
        tender.emdExemption = request.emdExemption(); tender.paperCostExemption = request.paperCostExemption();
        tender.tenderFee = request.tenderFee(); tender.tenderEmdFee = request.tenderEmdFee();
        tender.preBidMeeting = request.preBidMeeting(); tender.preBidMeetingAddress = request.preBidMeetingAddress();
        tender.tenderPublishingDateTime = request.tenderPublishingDateTime(); tender.documentDownloadStartDateTime = request.documentDownloadStartDateTime();
        tender.seekClarificationStartDateTime = request.seekClarificationStartDateTime(); tender.seekClarificationEndDateTime = request.seekClarificationEndDateTime();
        tender.bidSubmissionStartDateTime = request.bidSubmissionStartDateTime(); tender.bidSubmissionEndDateTime = request.bidSubmissionEndDateTime();
        tender.bidOpeningDateTime = request.bidOpeningDateTime(); tender.nitFileName = request.nitFileName();
        tender.dtcnFileName = request.dtcnFileName(); tender.otherFileName = request.otherFileName();
        return toResponse(tenders.save(tender));
    }

    @Transactional(readOnly = true)
    public List<TenderResponse> list() {
        return tenders.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().map(this::toResponse).toList();
    }

    private EntityNotFoundException missing(String label) { return new EntityNotFoundException(label + " master value was not found"); }
    private TenderResponse toResponse(Tender tender) {
        return new TenderResponse(tender.id, tender.tenderReferenceNumber, tender.procurementType,
            tender.tenderType.getName(), tender.tenderCategory.getName(), tender.tenderPublishingDateTime,
            tender.nitFileName, tender.dtcnFileName, tender.otherFileName);
    }
}