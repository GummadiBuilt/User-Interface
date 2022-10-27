export interface typeOfEstablishment extends changeTracking {
    establishmentDescription: string,
    changeTracking: changeTracking,
    active: boolean
}

export interface countries extends changeTracking {
    countryIsoCode: string,
    countryName: string,
    changeTracking: changeTracking,
    active: boolean
}

export interface applicationRoles extends changeTracking{
    id: number,
    roleName: string,
    roleDescription: string,
    displayToAll: boolean,
    changeTracking: changeTracking
}

export interface changeTracking {
    createdBy: string,
    createdDate: number,
    modifiedBy: string,
    modifiedDate: number
}

export interface registrationStatesData {
    stateIsoCode: string,
    stateName: string
}

export interface registrationCitiesData {
    id: number,
    cityName: string
}

export interface registrationMasterData extends typeOfEstablishment, countries, applicationRoles {
    countries: Array<countries>,
    typeOfEstablishments: Array<typeOfEstablishment>,
    applicationRoles: Array<applicationRoles>
}