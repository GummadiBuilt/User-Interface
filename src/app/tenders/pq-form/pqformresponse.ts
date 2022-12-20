export class pqFormResponse  {
    public id: number;
    public projectName: string;
    public workPackage: string;
    public typeOfStructure: object;
    public contractDuration: number;
    public durationCounter: string;
    public pqDocumentIssueDate: string;
    public pqLastDateOfSubmission: string;
    public tentativeDateOfAward: string;
    public scheduledCompletion: string;
    public workflowStep:string;

     constructor(d: any) {
        this.id = d.id;
        this.projectName = d.projectName;
        this.workPackage = d.workPackage;
        this.typeOfStructure = d.typeOfStructure;
        this.contractDuration = d.contractDuration;
        this.durationCounter = d.durationCounter;
        this.pqDocumentIssueDate = d.pqDocumentIssueDate;
        this.pqLastDateOfSubmission = d.pqLastDateOfSubmission;
        this.tentativeDateOfAward = d.tentativeDateOfAward;
        this.scheduledCompletion = d.scheduledCompletion;
        this.workflowStep = d.workflowStep;
       }
 }