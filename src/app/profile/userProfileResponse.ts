export class userProfileResopnse {
    [x: string]: any;
    public id: string;
    public companyName: string;
    public yearOfEstablishment: number;
    public typeOfEstablishment: [
        string
    ];
    public address: string;
    public countryIsoCode: string;
    public stateIsoCode: string;
    public cityId: number;
    public contactFirstName: string;
    public contactLastName: string;
    public contactDesignation: string;
    public contactPhoneNumber: string;
    public contactEmailAddress: string;

    constructor(d: any) {
        this.id = d.id;
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