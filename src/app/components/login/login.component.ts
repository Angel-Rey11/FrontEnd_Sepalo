import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import { SHA256 } from 'crypto-js';
import { User } from 'src/app/model/User';
declare var bootstrap: any;


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
    const result = await this.http.getUser(this.userLogin,this.convertTextLogin()).toPromise();
    
    if(result != null) {
        this.http.UserLog = result;
        this.router.navigate(['/main-menu']);
    } else {
      const toastLiveExample = document.getElementById('liveToast')
          const toast = new bootstrap.Toast(toastLiveExample)
      
          toast.show()
      }
    }

  async SignUp() {
    const user: User = {
      username: this.userSign,
      password: this.convertTextSign()
    };
    
    if(user != null && this.passSign == this.passRepeat) {
      await this.http.postUser(user).toPromise();
      const toastLiveExample = document.getElementById('liveToast3')
        const toast = new bootstrap.Toast(toastLiveExample)
    
        toast.show()
        this.userSign = '';
        this.passSign = '';
        this.passRepeat = '';
    } else {
      console.log("No se ha podido insertar el usuario");
    }
    
  }

  convertTextSign(): string {
    return SHA256(this.passSign).toString();
  }

  convertTextLogin(): string {
    return SHA256(this.passLogin).toString();
  }
}
