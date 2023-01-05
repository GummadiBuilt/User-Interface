export class tenderApplicantRankingResopnse {
    applicant_rank: number;
    modified_by: string;
    tender_info_id: string;
    modified_date: string;
    applicant_form_id: number;
    justification_note: string;
    company_name: string;

    constructor(d: any) {
        this.applicant_rank = d.applicant_rank;
        this.modified_by = d.modified_by;
        this.tender_info_id = d.tender_info_id;
        this.modified_date = d.modified_date;
        this.applicant_form_id = d.applicant_form_id;
        this.justification_note = d.justification_note;
        this.company_name = d.company_name;
    }
}