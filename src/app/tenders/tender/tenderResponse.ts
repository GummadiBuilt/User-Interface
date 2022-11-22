import { typeOfContracts } from "../create-tender/createTender";

export class tenderResopnse  {
    private contractDuration: number;
    private durationCounter: string;
    private estimatedBudget: number;
    private typeOfContract: object;
    private lastDateOfSubmission: string;
    private projectLocation: string;
    private tenderDocumentName: string;
    private tenderId: string;
    private typeOfWork: string;
    private workDescription: string;
    private workflowStep: string;
    private tenderFinanceInfo: string;
    private tenderDocumentSize: number;
    private changeTracking:object;
 
     constructor(d: any) {
        debugger;
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
       }
 }
