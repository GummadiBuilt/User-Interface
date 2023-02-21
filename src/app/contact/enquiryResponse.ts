export class enquiryResopnse {
    private id: number;
    private applicationRole: number;
    private userName: string;
    private mobileNumber: number;
    private emailAddress: string;
    private enquiryDescription: string;

    constructor(d: any) {
        this.id = d.id;
        this.applicationRole = d.users;
        this.userName = d.userName;
        this.mobileNumber = d.mobileNumber;
        this.emailAddress = d.emailAddress;
        this.enquiryDescription = d.enquiryDescription;
    }
}