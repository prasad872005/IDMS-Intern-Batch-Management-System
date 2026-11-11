export type CardType = 'FREE' | 'PREMIUM';
export interface Batch {
  id: number;
  batchName: string | null;
  startDate: string;
  endDate: string;
  internCount: number;
}
export interface Intern { id:number; internId:string; name:string; email:string; mobileNumber:string; cardType:CardType; dateOfJoining:string; batchId:number; batchName:string; }
export interface InternPayload { name:string; email:string; mobileNumber:string; cardType:CardType; dateOfJoining:string; batchId:number; }
