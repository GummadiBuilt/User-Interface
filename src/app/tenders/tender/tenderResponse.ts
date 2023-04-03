import { typeOfContracts } from "../create-tender/createTender";

export class tenderResopnse  {
    public contractDuration: number;
    public durationCounter: string;
    public estimatedBudget: number;
    public typeOfContract: object;
    public lastDateOfSubmission: string;
    public projectLocation: string;
    public tenderDocumentName: string;
    public tenderId: string;
    public typeOfWork: object;
    public workDescription: string;
    public workflowStep: string;
    public tenderFinanceInfo: string;
    public tenderDocumentSize: number;
    public changeTracking:object;
    public pqFormId:number;
    public projectName: string;
    public applicationFormId:number;
    public applicationFormStatus:string;
    public contractorBidId:number;
    public contractorActionTaken:string;
    public fileUpload:boolean;

     constructor(d: any) {
        this.contractDuration = d.contractDuration;
        this.durationCounter = d.durationCounter;
        this.estimatedBudget = d.estimatedBudget;
        this.typeOfContract = d.typeOfContract;
        this.lastDateOfSubmission = d.lastDateOfSubmission;
        this.projectLocation = d.projectLocation;
        this.tenderDocumentName = d.tenderDocumentName;
        this.tenderId = d.tenderId;
        this.typeOfWork = d.typeOfWork;
        this.workDescription = d.workDescription;
        this.workflowStep = d.workflowStep;
        this.tenderFinanceInfo = d.tenderFinanceInfo;
        this.tenderDocumentSize = d.tenderDocumentSize;
        this.changeTracking = d.changeTracking;
        this.pqFormId = d.pqFormId;
        this.projectName = d.projectName;
        this.applicationFormId = d.applicationFormId;
        this.applicationFormStatus = d.applicationFormStatus;
        this.contractorBidId = d.contractorBidId;
        this.contractorActionTaken = d.contractorActionTaken;
        this.fileUpload = d.fileUpload;
       }
 }
