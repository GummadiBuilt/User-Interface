export class userRegistrationResopnse{
    private applicationRoleId: number;
    private companyName: string;
    private yearOfEstablishment: number;
    private typeOfEstablishment: [
      string
    ];
    private address: string;
    private countryCountryIsoCode: string;
    private stateStateIsoCode: string;
    private cityId: number;
    private contactFirstName: string;
    private contactLastName: string;
    private contactDesignation: string;
    private contactPhoneNumber: string;
    private contactEmailAddress: string;
 
     constructor(d: any) {
        this.applicationRoleId = d.users;
        this.companyName = d.companyName;
        this.yearOfEstablishment = d.yearOfEstablishment;
        this.typeOfEstablishment = d.typeOfEstablishmentCtrl;
        this.address = d.address;
        this.countryCountryIsoCode = d.country.countryIsoCode;
        this.stateStateIsoCode = d.state.stateIsoCode;
        this.cityId = d.city.id;
        this.contactFirstName = d.contactFirstName;
        this.contactLastName = d.contactLastName;
        this.contactDesignation = d.contactDesignation;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
       }
 }