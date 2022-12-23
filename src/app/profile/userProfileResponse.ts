export class userProfileResopnse {
    private id: number;
    private applicationRoleDto: string;
    private companyName: string;
    private yearOfEstablishment: number;
    private typeOfEstablishment: [
        string
    ];
    private address: string;
    private country: string;
    private state: string;
    private city: number;
    private contactFirstName: string;
    private contactLastName: string;
    private contactDesignation: string;
    private contactPhoneNumber: string;
    private contactEmailAddress: string;

    constructor(d: any) {
        this.id = d.id;
        this.applicationRoleDto = d.applicationRoleDto;
        this.companyName = d.companyName;
        this.yearOfEstablishment = d.yearOfEstablishment;
        this.typeOfEstablishment = d.typeOfEstablishmentCtrl;
        this.address = d.address;
        this.country = d.country.country;
        this.state = d.state;
        this.city = d.city;
        this.contactFirstName = d.contactFirstName;
        this.contactLastName = d.contactLastName;
        this.contactDesignation = d.contactDesignation;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
    }
}