import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Batch, Intern, InternPayload, CardType } from './models';
@Injectable({providedIn:'root'})
export class IdmsService {
 private http=inject(HttpClient); private base='http://localhost:8080/api';
 getBatches():Observable<Batch[]>{return this.http.get<Batch[]>(`${this.base}/batches`);}
createBatch(batchName: string, startDate: string): Observable<Batch> {
  return this.http.post<Batch>(`${this.base}/batches`, {
    batchName,
    startDate
  });
}
 deleteBatch(id:number):Observable<void>{return this.http.delete<void>(`${this.base}/batches/${id}`);}
 getInterns(search='',batchId:number|null=null,cardType:CardType|''=''):Observable<Intern[]>{let p=new HttpParams();if(search)p=p.set('search',search);if(batchId)p=p.set('batchId',batchId);if(cardType)p=p.set('cardType',cardType);return this.http.get<Intern[]>(`${this.base}/interns`,{params:p});}
 createIntern(data:InternPayload):Observable<Intern>{return this.http.post<Intern>(`${this.base}/interns`,data);}
 updateIntern(id:number,data:InternPayload):Observable<Intern>{return this.http.put<Intern>(`${this.base}/interns/${id}`,data);}
 deleteIntern(id:number):Observable<void>{return this.http.delete<void>(`${this.base}/interns/${id}`);}
 getBatchInterns(id:number):Observable<Intern[]>{return this.http.get<Intern[]>(`${this.base}/batches/${id}/interns`);}
}
