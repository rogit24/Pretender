export interface MasterOption { id: number; name: string; }
export interface TenderDraft {
  procurementType: string; tenderReferenceNumber: string; tenderTypeId: number | null; numberOfCoversId: number | null;
  tenderCategoryId: number | null; workItemProductCategoryId: number | null; numberOfBidOpenersId: number | null;
  formOfContractId: number | null; bidValidityDays: number | null; cover1Description: string; cover2Description: string;
  deliveryPeriodDays: number | null; tendererClassId: number | null; emdExemption: boolean; paperCostExemption: boolean;
  tenderFee: number | null; tenderEmdFee: number | null; preBidMeeting: boolean; preBidMeetingAddress: string;
  tenderPublishingDateTime: string; documentDownloadStartDateTime: string; seekClarificationStartDateTime: string;
  seekClarificationEndDateTime: string; bidSubmissionStartDateTime: string; bidSubmissionEndDateTime: string;
  bidOpeningDateTime: string; nitFileName: string; dtcnFileName: string; otherFileName: string;
}
export interface MasterDefinition { key: string; label: string; }
export const MASTER_DEFINITIONS: MasterDefinition[] = [
  { key: 'tender-type', label: 'Tender Type' }, { key: 'number-of-covers', label: 'Number of Covers' },
  { key: 'tender-category', label: 'Tender Category' }, { key: 'work-item-product-category', label: 'Work Item Product Category' },
  { key: 'number-of-bid-openers', label: 'Number of Bid Openers' }, { key: 'form-of-contract', label: 'Form of Contract' },
  { key: 'tenderer-class', label: 'Tenderer Class' },
];
export const emptyTender = (): TenderDraft => ({
  procurementType: 'Open Tender', tenderReferenceNumber: '', tenderTypeId: null, numberOfCoversId: null,
  tenderCategoryId: null, workItemProductCategoryId: null, numberOfBidOpenersId: null, formOfContractId: null,
  bidValidityDays: null, cover1Description: '', cover2Description: '', deliveryPeriodDays: null, tendererClassId: null,
  emdExemption: false, paperCostExemption: false, tenderFee: null, tenderEmdFee: null, preBidMeeting: false,
  preBidMeetingAddress: '', tenderPublishingDateTime: '', documentDownloadStartDateTime: '', seekClarificationStartDateTime: '',
  seekClarificationEndDateTime: '', bidSubmissionStartDateTime: '', bidSubmissionEndDateTime: '', bidOpeningDateTime: '',
  nitFileName: '', dtcnFileName: '', otherFileName: '',
});