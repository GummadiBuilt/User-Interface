export class contractorUsersResponse {
    public id: number;
    public contact_email_address: string;
    public contact_last_name: string;
    public contact_first_name: string;
    public applied_tenders: number;
    public role_name: string;
    public company_name: string;

    constructor(d: any) {
        this.id = d.id;
        this.contact_email_address = d.contact_email_address;
        this.contact_last_name = d.contact_last_name;
        this.contact_first_name = d.contact_first_name;
        this.applied_tenders = d.applied_tenders;
        this.role_name = d.role_name;
        this.company_name = d.company_name;
    }
}