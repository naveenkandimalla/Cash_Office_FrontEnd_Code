import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/finally';
import { Observable } from 'rxjs';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { apiURL,loginURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'

})
export class LoginComponent {
  loginForm: FormGroup;
  userDtls:any;
  roles: string[] = [];
  constructor(private http :HttpClient,private router:Router,private tokenstorge:TokenStorageService){
    this.loginForm = new FormGroup(
      {
        username: new FormControl('',Validators.required),
        password:new FormControl('',Validators.required)
  });

}
 
ngOnInit(){
   this.tokenstorge.signOut();
}
  
  userLogin(value) {
    console.log(this.loginForm.value);
    let Id=this.loginForm.get('username').value;
    let Pwd=this.loginForm.get('password').value.toString();
  
    this.http.post(loginURL+`/login` ,{
      "username":Id,
      "password":Pwd
    }).subscribe(
      (response) => {
        this.userDtls=response; 
        console.log(response);
        if( this.userDtls.statuscode == 200)  {
          this.tokenstorge.saveToken(this.userDtls.accessToken);
          this.tokenstorge.saveUsername(this.userDtls.username);
          this.tokenstorge.saveAuthorities(this.userDtls.authorities);
          this.tokenstorge.saveuserid(this.userDtls.userid);
          this.router.navigate(['/dashboard']);
         // this.router.navigateByUrl('/dashboard'); 
        }else{
          alert("Bad credentials")
        }
        
        
       
  });
}


reloadPage() {
  window.location.reload();
}

} 
