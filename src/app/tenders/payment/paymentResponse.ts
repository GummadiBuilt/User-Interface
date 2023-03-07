export class paymentResponse {
    public contactName: string;
    public paymentAmount: number;
    public roleId: number;
    public paymentDescription: string;
    public contactPhoneNumber: string;
    public contactEmailAddress: string;
    public notifyViaEmail: boolean;
    public notifyViaSms: boolean;

    constructor(d: any) {
        this.contactName = d.contactName;
        this.paymentAmount = d.paymentAmount;
        this.roleId = d.roleId;
        this.paymentDescription = d.paymentDescription;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
        this.notifyViaEmail = d.notifyViaEmail;
        this.notifyViaSms = d.notifyViaSms;
    }
}