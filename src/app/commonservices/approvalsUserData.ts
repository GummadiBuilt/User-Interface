export class registrationApprovalResopnse {
  applicationRoleId: number;
  // firstName: string;
  // lastName: string;
  // email: string;
  companyName: string;
  yearOfEstablishment: number;
  typeOfEstablishment: [
    string
  ];
  address: string;
  country: object;
  state: object;
  city: object;
  contactFirstName: string;
  contactLastName: string;
  contactDesignation: string;
  contactPhoneNumber: string;
  contactEmailAddress: string;
  // coordinatorName: string;
  // coordinatorMobileNumber: string;


  constructor(d: any) {
    this.applicationRoleId = d.users;
    // this.firstName = d.firstName;
    // this.lastName = d.lastName;
    // this.email = d.email;
    this.companyName = d.companyName;
    this.yearOfEstablishment = d.yearOfEstablishment;
    this.typeOfEstablishment = d.typeOfEstablishment;
    this.address = d.address;
    this.country = d.country;
    this.state = d.state;
    this.city = d.city;
    this.contactFirstName = d.contactFirstName;
    this.contactLastName = d.contactLastName;
    this.contactDesignation = d.contactDesignation;
    this.contactPhoneNumber = d.contactPhoneNumber;
    this.contactEmailAddress = d.contactEmailAddress;
  }
}