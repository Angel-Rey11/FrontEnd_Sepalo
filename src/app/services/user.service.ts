import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    console.log('getAllUsers');
    return this.http.get<User[]>(`${environment.serverURL}/api/User/GetAll`);
  }

  public postUser(user : User): Observable<User> {
    let reqHeaders = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post<User>(`${environment.serverURL}/api/User`, JSON.stringify(user), {headers:reqHeaders});
  }

  public getUser(username: string, password:string): Observable<User> {
    const url = `${environment.serverURL}/api/User/get/${username}/${password}`;
    return this.http.get<User>(url);
  }
}

