export interface typeOfEstablishment extends changeTracking {
    establishmentDescription: string,
    changeTracking: changeTracking,
    active: boolean
}
export interface typeOfContracts extends changeTracking {
    id:number,
    contractShortCode: string,
    typeOfContract:string,
    changeTracking: changeTracking,
    active: boolean
}
export interface changeTracking {
    createdBy: string,
    createdDate: number,
    modifiedBy: string,
    modifiedDate: number
}
export interface tenderMasterData extends typeOfEstablishment, typeOfContracts {
     typeOfEstablishments: Array<typeOfEstablishment>,
     typeOfContracts: Array<typeOfContracts>
}