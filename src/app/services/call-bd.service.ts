import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Call } from '../model/Call';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { callbackify } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CallBDService {

  constructor(private readonly http: HttpClient) { }

  public getAllCalls():Observable<Call[]> {
    return this.http.get<Call[]>(`${environment.serverURL}/api/Call/GetAll`)
  }

  public getCall(id:number):Observable<Call> {
    const url = `${environment.serverURL}/api/Call/get/${id}`;
    return this.http.get<Call>(url);
  }

  public updateCall(id:Number, Call:Call) {
    this.http.put(`${environment.serverURL}/api/Call/Update/${id}`, Call);
  }
}
