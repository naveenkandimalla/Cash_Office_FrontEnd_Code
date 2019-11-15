// User Management - Admin Module 

import { Component, NgModule,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


import { PagerService, GlobalServices } from './../../services/index';
import { HttpClient, HttpParams} from '@angular/common/http';

import { AdminService } from './admin.service';
import { Http } from '@angular/http';
import { Users } from './users';
import { apiURL } from '../../_nav';



@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
    // ,  HttpClient, HttpHeaders
  ]
})

@Component({
  templateUrl: './user-management.component.html'
})

export class UserManagementComponent {
  userInput:FormGroup ;
  groupInput:FormGroup;
  viewUserGroups = false ;
  viewUserMgt = true ;
  users:any;
  pager: any = {};
  pagedItems: any[];
  usergroup:any;
  statusMessage: string;
  branchname:any;
  branchdetalis:any;
  branchcode:any;
  abc:any;
  savelabel:boolean=true;
  assigngrouplabel:boolean=true;

  constructor(private http: HttpClient,private pagerService: PagerService,private adminservice: AdminService){
    this.userInput = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      enabled: new FormControl(''),
      branchName: new FormControl('', Validators.required),
      usermangenentid: new FormControl('')

    }) ;
  
    this.groupInput = new FormGroup({
      username: new FormControl({value:'', disabled:true}), //Validators.required),
      firstName: new FormControl({value:'', disabled:true}),
      lastName: new FormControl({value:'', disabled:true}),
      groupName: new FormControl('', Validators.required),
      groupDesc: new FormControl({value:'', disabled:true}),
      enabledusergroup: new FormControl(''),
      groupmemberid: new FormControl({value:'', disabled:true})
      // groupid:new FormControl({value:'', disabled:true})
    }) ; 
     
  }

  

  ngOnInit() {

     this.getusers();
     this.getallbranchnamesdetails();
     this.userInput.controls['password'].setValue('Temp#1234');
      this.fetchtgroupdetails();   
  }
    
// used for fecthing all existing users
  getusers(){ 
    this.adminservice.getallusers().subscribe((bd) => {
         this.users=bd
         console.log(bd)
          // setpage is used for pagination
          this.setPage(1);},
        (error) =>{
            console.log(error);
            alert("error occured while fetching existing users details");
        } 
    );     
}

setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.users.length, page, 10);

  // get current page of items
  this.pagedItems = this.users.slice(this.pager.startIndex, this.pager.endIndex + 1);
}


//used for fetching bank branch details
getallbranchnamesdetails(){
  this.adminservice.getallbranchnames().subscribe((bbb) => {
     this.branchdetalis=bbb;
      console.log(bbb);  
        },
        (error) =>{
            console.log(error);
            alert("error occured while fetching existing branch details");
        }
    );    
}


enablrsavebutton(){
  this.savelabel=false;
}


  save(userInput) {

    let username =  this.userInput.value.username
    let firstname = this.userInput.value.firstName
    let lastname = this.userInput.value.lastName
    let branchnamedeetail = this.userInput.value.branchName

  if(username !=null && firstname !=null && lastname !=null &&  branchnamedeetail !=null && username !='' && firstname !='' && lastname !='' &&  branchnamedeetail !=''){

    let branchname = this.userInput.value.branchName;
    let usermangementid = this.userInput.value.usermangenentid;
    if(this.userInput.get('enabled').value == null || this.userInput.get('enabled').value == false ){ 
      this.userInput.controls['enabled'].setValue(0);
     }else{
       this.userInput.controls['enabled'].setValue(1);
    }
    let usersBody = this.userInput.value;
    let bcode = this.branchdetalis.filter(app => app.branch_name == branchname )
    let bcode2;

    if(bcode.length != 0){
      bcode2 = bcode[0].branch_code
    }

    let record = this.users.filter(app => app.userId == usermangementid ) 

     if(record.length != 0){
        alert("we are updating existing record ");
        let userid=record[0].userId;
        console.log(userid);
        console.log(bcode2);
        console.log(usersBody);
       
        this.http.put(`${apiURL}/admin/usermanagement/userupdatedrecord?userid=${userid}&branchcode=${bcode2}`,usersBody)
        .subscribe(
        (result) => {
          console.log(result);
          alert("user is updated successfully");
          this.assigngrouplabel=false;
          this.ngOnInit();
        },error =>{
          alert("Error while updating existing user");
          console.log(error);
        }
      );
    }else{
  
         if(this.userInput.get('enabled').value == null || this.userInput.get('enabled').value == false ){ 
             this.userInput.controls['enabled'].setValue(0);
            }else{
              this.userInput.controls['enabled'].setValue(1);
           }
      let createdby = "admintest";
      this.http.post(`${apiURL}/admin/usersave?branchcode=${bcode2}&createdby=${createdby}`,
      this.userInput.value).subscribe((response) => {
          console.log(response);
          alert("Record is successfully saved ");
          this.assigngrouplabel=false;
          this.ngOnInit();
        },(error) =>{
          console.log(error);
          alert("Error while saving user record");
        }
      );

    }
  }else{
    alert("Please filled all required fields");
  }
}
// used to find the user record using users first name
  search(value){
    let cashier=this.users.filter(app => app.firstName == value);
    console.log(cashier[0]);
    if(cashier.length != 0){
      let bcode = this.branchdetalis.filter(app => app.branch_code == cashier[0].branchCode);
      this.userInput.patchValue({
        username: cashier[0].username,
        password: cashier[0].password,
        lastName: cashier[0].lastName,
        firstName: cashier[0].firstName ,
        branchName:bcode[0].branch_name,
        usermangenentid:cashier[0].userId,
        enabled: cashier[0].enabled
      });
      this.assigngrouplabel=false;
      this.savelabel=false;
    }else{
      alert("No user exits with this firstname "+value);
    }    
  }
 
 

  // this code is used for patching the user details
  patchuserdetails(u) {
    let bcode = this.branchdetalis.filter(app => app.branch_code == u.branchCode)
    let branchcode;
    if(bcode.length != 0){
      branchcode=bcode[0].branch_name;
      console.log("branchcode"+branchcode);
    }
   
    this.userInput.patchValue({
      username:u.username,
      password:u.password,
      lastName:u.lastName,
      firstName:u.firstName,
      enabled:u.enabled,
      branchName:branchcode,
      usermangenentid:u.userId 
    })

    this.assigngrouplabel=false;
    this.savelabel=false;
 }
  
 // from here assigingroup code satrts 
 assignGroup(){
    this.viewUserMgt = false ;
    this.viewUserGroups = true ; 
    this.userInput.disable() ;
    this.fetchusergroupdetails();
  }
  

  clear(){
    this.userInput.reset() ;
    this.assigngrouplabel=true;
    this.savelabel=true;
    this.userInput.controls['password'].setValue('Temp#1234');
  }
  
  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

// below code deals assigning the group details ------------------------------------------
  
 // fetching the all assigngroupdetails 
 groupdetails:any
 fetchtgroupdetails(){
   this.http.get(`${apiURL}/admin/usermangement/tgroupdetails`).subscribe((result)=>{
    console.log(result)
    this.groupdetails=result;   
   },(error)=>{
     console.log(error);
     alert("error occured while fetching the group details");
   })
 }


 //fetching existing  usergroup details
 usergroupdetails:any;
 fetchusergroupdetails(){
 let  username = this.userInput.value.username
  this.http.get(`${apiURL}/admin/usermangement/usergroupdetails?username=${username}`).
   subscribe((result)=>{
    console.log(result)
    this.usergroupdetails=result
   if(this.usergroupdetails.length==0 ||this.usergroupdetails =="" || this.usergroupdetails==null ){
         alert("no group member is record is found with this user name ");
      }
   },(error)=>{
     console.log(error);
     alert("error occured while fetching existing groups assign for the user");
   })
 }

 getusergrouppatchdetails(usergroup){
    this.groupInput.patchValue({
      username:usergroup.username,
      firstName:usergroup.firstname,
      lastName:usergroup.lastname,
      groupName:usergroup.groupname,
      groupDesc:usergroup.groupdesc,
      enabledusergroup:usergroup.enable,
      groupmemberid:usergroup.groupmemid  
    })
 }

 // used for patch the group description  using group name
 updategroupdesc(event){
  let desc = this.groupdetails.filter(app => app.groupname ==  event.target.value);
  if(desc.length != 0 ){
    this.groupInput.patchValue({
      groupDesc: desc[0].groupdesc
    }
    );
  }
 }
 

 // used for saving new group details which is assign to particular user
  saveUserGroups(){

    let groupmemid = this.groupInput.get('groupmemberid').value;
    let groupname =  this.groupInput.get('groupName').value;

if(groupname != null && groupname !=''){

    if(groupmemid >0){
      alert("we are updating the record")         
        if(this.groupInput.get('enabledusergroup').value == null || this.groupInput.get('enabledusergroup').value=="false" || this.groupInput.get('enabledusergroup').value ==0){ 
           this.groupInput.controls['enabledusergroup'].setValue(0);
         }else{
            this.groupInput.controls['enabledusergroup'].setValue(1);
            alert(this.groupInput.get('enabledusergroup').value )
        }

     let groupname = this.groupInput.get('groupName').value
     let group = this.groupdetails.filter(app => app.groupname ==  groupname);
     let groupcode =group[0].id
     let groupmemnerid = this.groupInput.get('groupmemberid').value
     var enable = this.groupInput.get('enabledusergroup').value
     let modify = "test"

      this.http.put(`${apiURL}/admin/usermangement/updategroupmember?enable=${enable}`,{
       "groupMemId":groupmemnerid,
       "groupId":groupcode,
       "enabled":enable,
       "modifiedBy":modify
      })
      .subscribe((result)=>{
        console.log(result)
        alert("record has been updated");
      }
      ,
      (error)=>{
        console.log(error);
        alert("error occured while updating the record");
      })
    
  }else{
    if(this.groupInput.get('enabledusergroup').value == null || this.groupInput.get('enabledusergroup').value=="false" || this.groupInput.get('enabledusergroup').value ==0){ 
        this.groupInput.controls['enabledusergroup'].setValue(0);
        } else {
          this.groupInput.controls['enabledusergroup'].setValue(1);
     }
     let groupname = this.groupInput.get('groupName').value
     let group = this.groupdetails.filter(app => app.groupname ==  groupname);
     let groupcode =group[0].id
     let username = this.groupInput.get('username').value
     let enable = this.groupInput.get('enabledusergroup').value
     let createdby = "test"
     this.http.post(`${apiURL}/admin/usermangement/insertrecordgroupmember?enable=${enable}`,{
      "groupId":groupcode,
      "enabled":enable,
      "username":this.userInput.value.username,
      "createdBy":createdby
     }).subscribe((result)=>{ 
       console.log(result);
       alert("record has been inserted");
     },
     (error)=>{
       console.log(error);
       alert("error occured while record is saving");
     })
    }

  }else{
    alert("group name cannot be empty");
  }
}

  clearUserGroups(){
    this.groupInput.reset() ;
  }

  exitUserGroups(){
    this.viewUserGroups = false ;
    this.viewUserMgt = true ;
    this.userInput.enable() ;
  }



  
}


