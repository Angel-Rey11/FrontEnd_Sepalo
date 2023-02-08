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
    const result = await this.http.getUser(this.userLogin,this.passLogin).toPromise();
    
    if(result != null) {
        const toastTrigger = document.getElementById('liveToastBtn')
        const toastLiveExample = document.getElementById('liveToast2')
        if (toastTrigger) {
            toastTrigger.addEventListener('click', () => {
            const toast = new bootstrap.Toast(toastLiveExample)
      
          toast.show()
        })
      }
      this.router.navigate(['/main-menu']);
    } else {
      const toastTrigger = document.getElementById('liveToastBtn')
      const toastLiveExample = document.getElementById('liveToast')
      if (toastTrigger) {
        toastTrigger.addEventListener('click', () => {
          const toast = new bootstrap.Toast(toastLiveExample)
      
          toast.show()
        })
      }
    }
  }

  async SignUp() {
    const user: User = {
      username: this.userSign,
      password: this.convertText()
    };
    
    if(user != null && this.passSign == this.passRepeat) {
      const result = await this.http.postUser(user).toPromise();
      const toastTrigger = document.getElementById('liveToastBtn3')
      const toastLiveExample = document.getElementById('liveToast3')
      if (toastTrigger) {
        toastTrigger.addEventListener('click', () => {
        const toast = new bootstrap.Toast(toastLiveExample)
    
        toast.show()
      })
      }
      console.log(result);
    } else {
      console.log("No se ha podido insertar el usuario");
    }
    
  }

  convertText(): string {
    return SHA256(this.passSign).toString();
  }
}
