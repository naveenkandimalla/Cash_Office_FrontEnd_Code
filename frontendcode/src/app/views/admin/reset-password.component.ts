// Reset Password - Admin Module

import { Component, NgModule,Input, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SELECTOR } from 'ngx-bootstrap/modal/modal-options.class';
import { AdminService } from './admin.service';


@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
  ]
})

@Component({
  templateUrl: 'reset-password.component.html',
  selector: 'app-child'
})
export class ResetPasswordComponent {


   userdetails:any;
   statusMessage:any;
   desc:any;
   userInputDetails:FormGroup;
   passworddetails:any;

  constructor(private adminservice:AdminService){
    this.userInputDetails = new FormGroup({
      pusername: new FormControl(''), 
      pfirstName: new FormControl(''),
      plastName: new FormControl(''),
      userid:new FormControl('')
    }) ;
  }

  ngOnInit(){ 
    this.getallusersdetails();
  }

   getallusersdetails(){
    this.adminservice.getallusers().subscribe((result) =>{
      this.userdetails=result;
      console.log(result);
     },
    (error) =>{
        console.log(error);
        alert("error occured while fetching user details");
    }
 ); 
    
}

   // to find user by  using change event
   updategroupdesc(event){         
     this.desc = this.userdetails.filter(app => app.username == event.target.value);
    if(this.desc != 0){
      this.userInputDetails.patchValue({
        pfirstName: this.desc[0].firstName,
        plastName:this.desc[0].lastName,
         userid  :this.desc[0].userId
      });
    }   
   }

  
   // updating the user password
   resetpass(v){
    let us = v.pusername;
    let userid= v.userid;
    this.adminservice.resetuserspassword(us,v,userid)
    .subscribe((result) => {
      console.log(result);
      alert("password is updated successfully");
      this.clear();
     },
    (error) =>{
        console.log(error);
        alert("error occured while updating password");
    }); 
}

  clear(){
    this.userInputDetails.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
