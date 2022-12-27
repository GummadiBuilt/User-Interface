export class userProfileResopnse {
    private id: string;
    private applicationRoleDto: string;
    private companyName: string;
    private yearOfEstablishment: number;
    private typeOfEstablishment: [
        string
    ];
    private address: string;
    private countryIsoCode: string;
    private stateIsoCode: string;
    private cityId: number;
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
        this.countryIsoCode = d.country.countryIsoCode;
        this.stateIsoCode = d.state.stateIsoCode;
        this.cityId = d.city.id;
        this.contactFirstName = d.contactFirstName;
        this.contactLastName = d.contactLastName;
        this.contactDesignation = d.contactDesignation;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
    }
}