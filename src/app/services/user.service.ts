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

  public postUser(user : User): Observable<any> {
    let data:User ={
      id:user.id,
      username:user.username,
      password:user.password
    }
    return this.http.post<any>(`${environment.serverURL}/api/User`, data, {
      headers: { "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
      "Access-Control-Allow-Methods": 'OPTIONS,POST,GET', // this states the allowed methods
      "Content-Type": "application/json" }
    });
  }

  public getUser(username: string, password:string): Observable<User> {
    const url = `${environment.serverURL}/api/User/get/${username}/${password}`;
    return this.http.get<User>(url);
  }
}

