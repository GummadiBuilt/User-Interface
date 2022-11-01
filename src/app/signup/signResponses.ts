export class userRegistrationResopnse{
    private applicationRoleId: number;
    private firstName: string;
    private lastName: string;
    private email: string;
    private companyName: string;
    private yearOfEstablishment: number;
    private typeOfEstablishment: [
      string
    ];
    private address: string;
    private countryCountryIsoCode: string;
    private stateStateIsoCode: string;
    private cityId: number;
    private contactName: string;
    private contactDesignation: string;
    private contactPhoneNumber: string;
    private contactEmailAddress: string;
    private coordinatorName: string;
    private coordinatorMobileNumber: string;
 
     constructor(d: any) {
        this.applicationRoleId = d.users;
        this.firstName = d.firstName;
        this.lastName = d.lastName;
        this.email = d.email;
        this.companyName = d.companyName;
        this.yearOfEstablishment = d.yearOfEstablishment;
        this.typeOfEstablishment = ['CIVIL'];
        this.address = d.address;
        this.countryCountryIsoCode = d.country.countryIsoCode;
        this.stateStateIsoCode = d.state.stateIsoCode;
        this.cityId = d.city.id;
        this.contactName = d.contactName;
        this.contactDesignation = d.contactDesignation;
        this.contactPhoneNumber = d.contactPhoneNumber;
        this.contactEmailAddress = d.contactEmailAddress;
        this.coordinatorName = d.coordinatorName;
        this.coordinatorMobileNumber = d.coordinatorMobileNumber;
       }
 }