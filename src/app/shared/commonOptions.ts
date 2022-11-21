export interface approveReject {
    id: string,
    text: string
}

export interface durationCounter {
    id: string,
    text: string
}

export interface workflowStep {
    id: string,
    text: string
}
export interface commonOptionsData extends approveReject, durationCounter, workflowStep{
    approveReject: Array<approveReject>,
    durationCounter: Array<durationCounter>,
    workflowStep: Array<workflowStep>
}