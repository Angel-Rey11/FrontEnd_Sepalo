import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import { SHA256 } from 'crypto-js';
import { User } from 'src/app/model/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: string = '';
  passLogin: string = '';
  userSign: string = '';
  passSign: string = '';
  passRepeat: string = '';

  constructor(private router:Router,private readonly http: UserService) { }

  ngOnInit(): void {
  }

  async click() {
    const result = await this.http.getUser(this.userLogin,this.passLogin).toPromise();
    if(result != null) {
      this.router.navigate(['/main-menu']);
    }
      console.log("El usuario no existe");
  }

  async SignUp() {
    const user: User = {
      username: this.userSign,
      password: this.convertText()
    };
    
    if(user != null && this.passSign == this.passRepeat) {
      const result = await this.http.postUser(user).toPromise();
      console.log(result);
    } else {
      console.log("No se ha podido insertar el usuario");
    }
  }

  convertText(): string {
    return SHA256(this.passSign).toString();
  }

}
