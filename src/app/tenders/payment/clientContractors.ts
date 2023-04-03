export interface applicationRole extends changeTracking{
    displayToAll:boolean
    id:number
    roleDescription:string
    roleName:string
}
export interface changeTracking {
    createdBy: string,
    createdDate: number,
    modifiedBy: string,
    modifiedDate: number
}
export interface paymentMasterData extends applicationRole {
    applicationRole: Array<applicationRole>
}