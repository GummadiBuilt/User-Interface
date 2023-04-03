export class paymentResponse {
    public companyName: string;
    public contactName: string;
    public contactPhoneNumber: string;
    public contactEmailAddress: string;
    public applicationRoleId: number;
    public applicationRoleName: string;
    public notifyViaEmail: boolean;
    public notifyViaSms: boolean;
    public paymentAmount: number;
    public paymentDescription: string;

    constructor(d: any) {
        this.companyName = d.companyName;
        this.contactName = d.contactName;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
        this.applicationRoleId = d.applicationRoleId;
        this.applicationRoleName = d.applicationRoleName;
        this.paymentAmount = d.paymentAmount;
        this.paymentDescription = d.paymentDescription;
        this.notifyViaEmail = d.notifyViaEmail;
        this.notifyViaSms = d.notifyViaSms;
    }
}