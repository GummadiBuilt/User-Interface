export class appliedTenderResopnse {
    public application_form_id: string;
    public establishment_description: string;
    public work_description: string;
    public type_of_contract: string;
    public contract_duration: number;
    public last_date_of_submission: string;
    public duration_counter: string;
    public estimated_budget: number;
    public tender_document_name: string;
    public tender_document_size: number;
    public project_location: string;
    public created_by: string;
    public project_name: string;
    public tender_id: string;
    public pq_id: string;
    public workflow_step: string;
    public company_name: string;

    constructor(d: any) {
        this.application_form_id = d.application_form_id;
        this.establishment_description = d.establishment_description;
        this.work_description = d.work_description;
        this.type_of_contract = d.type_of_contract;
        this.contract_duration = d.contract_duration;
        this.last_date_of_submission = d.last_date_of_submission;
        this.duration_counter = d.duration_counter;
        this.estimated_budget = d.estimated_budget;
        this.tender_document_name = d.tender_document_name;
        this.tender_document_size = d.tender_document_size;
        this.project_location = d.project_location;
        this.created_by = d.created_by;
        this.project_name = d.project_name;
        this.tender_id = d.tender_id;
        this.pq_id = d.pq_id;
        this.workflow_step = d.workflow_step;
        this.company_name = d.company_name;
    }
}