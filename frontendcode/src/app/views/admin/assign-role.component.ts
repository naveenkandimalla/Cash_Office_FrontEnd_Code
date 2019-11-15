// Assign Role - Admin Module 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams} from '@angular/common/http';
import { AdminService } from './admin.service';
import { apiURL } from '../../_nav';


@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule
  ]
})

@Component({
  templateUrl: 'assign-role.component.html'
})
export class AssignRoleComponent {

  displayPopUp = false;
  creationrole=true;
  validate:boolean=false
  groupdetails:any
  constructor(private http: HttpClient,private adminservice: AdminService){

  }

  ngOnInit() {
   this.fetchroledetails();
  }

  roleInput = new FormGroup({
    roleID: new FormControl('', Validators.required),
    roleDesc: new FormControl('', Validators.required)
  }) ;

  roleInput2 = new FormGroup({
    roleID1: new FormControl('', Validators.required),
    roleDesc1: new FormControl('', Validators.required),
    groupCode: new FormControl('', Validators.required),
    groupid: new FormControl(''),
    stauts: new FormControl('')
    });
 
  // fetching roleid and role name details
  roledetails:any;
  fetchroledetails(){
    this.adminservice.getallroledetails().subscribe((result) => {
     console.log(result);
     this.roledetails=result; 
   },
   (error) =>{
        console.log(error);
        alert("error occured while fetching role details");  
   });    
  }

 // used for patching exist role details
  patchrolederails(role){
       this.roleInput.patchValue({
        roleID:role.authority,
        roleDesc:role.groupauthoritydesc
       })
  }
  
 
  save(){

    let roleid = this.roleInput.get('roleID').value
    let roledesc = this.roleInput.get('roleDesc').value
    let bcode = this.roledetails.filter(app => app.authority == roleid );
    if(bcode.length != 0){ 
        alert("record is updating");
        let creationdate = bcode[0].creationDate;
        let modifieby ="test";
        this.http.put(`${apiURL}/admin/usermangement/updategroupauthoritymaster`,{
        "authority":roleid,
        "groupauthoritydesc":roledesc,
        "modifiedBy":modifieby,
        "creationDate":creationdate
       }).subscribe((result)=>{
         console.log(result)
         alert("record is updated");
         this.ngOnInit();
       },(error)=>{
         console.log(error)
         alert("error has occured while updating the record")
       })

    }else{
      let createdby ="test"
      this.http.post(`${apiURL}/admin/usermangement/insertgroupauthoritymaster`,{  
        "authority":roleid,
        "groupauthoritydesc":roledesc,
        "createdBy":createdby
       }).subscribe((result)=>{
         console.log(result)
         alert("record is sucessfully inserted");
         this.ngOnInit();
       },(error)=>{
         console.log(error)
         alert("errored occured while while inserting the record")
       })

    }
  }
 
clear(){
    this.roleInput.reset() ;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }


  assignRole(){
    this.displayPopUp = true;
    this.creationrole=false;
    this.getassignrolesdetails();
    this.fetchtgroupdetails();
  }

 // fetching all existing group details

 fetchtgroupdetails(){
  this.http.get(`${apiURL}/admin/usermangement/tgroupdetails`).subscribe((result)=>{
   console.log(result);
   this.groupdetails=result;   
  },(error)=>{
    console.log(error)
  })


}

assignroledetails:any
//fetching existing group detail assign for this particular role
getassignrolesdetails(){
    let roleid = this.roleInput.get('roleID').value
    this.http.get(`${apiURL}/admin/usermangement/assignroledetails?authority=${roleid}`).subscribe((result)=>{
      console.log(result)
      this.assignroledetails=result;
    if(this.assignroledetails.length<=0 || this.assignroledetails==null){
        alert("no group code  is assgined to this role id");
      }   
    },(error)=>{
      console.log(error);
      alert("error occured while fetching existing group details assign to this role id")
    })
  }

  
// used for patching the group desc description based on group code
  updategroupdesc(event){
    let groupname = this.roleInput2.get('groupCode').value
    let desc = this.groupdetails.filter(app => app.groupname ==  groupname);
    if(desc.length != 0 ){
     this.roleInput2.patchValue({
      roleDesc1: desc[0].groupdesc
     });
    }
    this.savelabelgroup=false;
  }

// patching the existing group details for that role id
  patchassignroledetails(assignrole,i){
    let desc = this.groupdetails.filter(app => app.groupdesc == assignrole[4] );
    let groupname =desc[0].groupname;
     this.roleInput2.patchValue({
      roleID1:assignrole[0],
      roleDesc1:assignrole[4],
      groupid:assignrole[2]
     })
     this.roleInput2.controls['groupCode'].setValue(groupname);
     // once the group is assign to role then it cannot be change
     this.roleInput2.get('groupCode').disable();
     this.savelabelgroup=false;
  }

  // used for saving the new assgin group to particular role
  assignrolesave(){
     let groupid = this.roleInput2.get('groupid').value;
     
     if(groupid=="" || groupid==null ){
        alert("we are inserting the record")
        if(this.roleInput2.get('stauts').value == null || this.roleInput2.get('stauts').value == false || this.roleInput2.get('stauts').value == ''){ 
           this.roleInput2.controls['stauts'].setValue(0);
        }else {
          this.roleInput2.controls['stauts'].setValue(1);
         }

        let authority = this.roleInput.value.roleID;
        let status = this.roleInput2.get('stauts').value;
        let createdby = "test";
        let groupname = this.roleInput2.get('groupCode').value
        let desc = this.groupdetails.filter(app => app.groupname ==  groupname);
        let groupid = desc[0].id
        let enabled;
         if(status=="1"){
             enabled ="o";
          }else{
              enabled="c";
          }

     this.http.post(`${apiURL}/admin/usermangement/insertrecordgroupauthority`,{
     "authority":authority,
     "groupid":groupid,
     "enabled":enabled,
     "createdby":createdby
     })
     .subscribe((result)=>{
       console.log(result)
       alert("record is saved successfully");
     },(error)=>{
       console.log(error);
       alert("error occured while inserting the record");
     })

  }else{
       if(this.roleInput2.get('stauts').value == null || this.roleInput2.get('stauts').value == false || this.roleInput2.get('stauts').value == '') { 
        this.roleInput2.controls['stauts'].setValue(0);
      }else {
          this.roleInput2.controls['stauts'].setValue(1);
     }
       let enabled;
         if(status=="1"){
            enabled ="o";
         }else{
           enabled="c";
         }

       let modifiedby ="test"
       let groupid = this.roleInput2.get('groupid').value
         this.http.put(`${apiURL}/admin/usermangement/updategroupauthoritymaster`,{
          "enabled":enabled,
           "modifiedby":modifiedby,
            "groupid":groupid
     }).subscribe((result)=>{
       console.log(result)
       alert("record is updated successfully")
     },(error)=>{
       console.log(error);
       alert("error occured while updating the record ");
     })  
    }
  }

  savelabelgroup:boolean=true;

  assignroleclear(){
    this.roleInput2.get('groupCode').reset();
    this.roleInput2.get('roleDesc1').reset();
    this.roleInput2.get('groupid').reset();
    this.roleInput2.get('stauts').reset();
    this.roleInput2.get('groupCode').enable();
    this.savelabelgroup=true;
  }

  assignroleexit(){
    this.displayPopUp = false;
    this.creationrole=true;
    this.assignroledetails=null;
    this.roleInput2.get('groupCode').enable();

  }




}
