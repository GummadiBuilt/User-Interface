export class clientUsersResponse {
    public id: number;
    public contact_email_address: string;
    public under_process_step: number;
    public recommended_step: number;
    public contact_last_name: string;
    public contact_first_name: string;
    public yet_to_publish_step: number;
    public role_name: string;
    public total_tenders: number;
    public publish_step: number;
    public company_name: string;
    public save_step: number;
    public suspended_step: number;

    constructor(d: any) {
        this.id = d.id;
        this.contact_email_address = d.contact_email_address;
        this.under_process_step = d.under_process_step;
        this.recommended_step = d.recommended_step;
        this.contact_last_name = d.contact_last_name;
        this.contact_first_name = d.contact_first_name;
        this.yet_to_publish_step = d.yet_to_publish_step;
        this.role_name = d.role_name;
        this.total_tenders = d.total_tenders;
        this.publish_step = d.publish_step;
        this.company_name = d.company_name;
        this.save_step = d.save_step;
        this.suspended_step = d.suspended_step;
    }
}