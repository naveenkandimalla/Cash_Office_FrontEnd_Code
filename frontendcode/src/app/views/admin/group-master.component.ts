// Group Master - Admin Module

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from './admin.service';
import { HttpClient, HttpParams} from '@angular/common/http';
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
  templateUrl: 'group-master.component.html'
})
export class GroupMasterComponent {

  groupdetails:any;
  savedlabel:boolean=true;
  constructor(private http: HttpClient,private adminservice: AdminService){

  }

  ngOnInit() {

    this.fetchtgroupdetails();
   }

  groupInput = new FormGroup({
    groupName: new FormControl('', Validators.required),
    groupDesc: new FormControl('', Validators.required),
    groupid: new FormControl('', Validators.required)
  }) ;

// used for fectching group details
  fetchtgroupdetails(){
    this.http.get(`${apiURL}/admin/usermangement/tgroupdetails`).subscribe((result)=>{
    console.log(result)
    this.groupdetails=result;
    },(error)=>{
      console.log(error)
      alert("error occured while fetching group details");
    })
  }


  //patching the existing group details
  patchgroupdetails(group){
    this.groupInput.patchValue({
     "groupName":group.groupname,
     "groupDesc":group.groupdesc,
     "groupid":group.id
    })
    this.savedlabel=false;
  }

  // saving the new group record 
  savegrouprecord(){
     let groupname =  this.groupInput.get('groupName').value
     let groupdesc =  this.groupInput.get('groupDesc').value
     let createdby = "test";
    this.http.post(`${apiURL}/admin/groupmaster/insertrecordgroup`,{
       "groupname":groupname,
       "groupdesc":groupdesc,
       "createdby":createdby
    })
    .subscribe((result)=>{
      console.log(result)
      alert("record is inserted successfully");
      this.ngOnInit();
      this.clear();
    },(error)=>{
      console.log(error);
      alert("error occured while inserting record");
    })
  }

//updating if we have existing group
 updategrouprecord(){
  let groupname =  this.groupInput.get('groupName').value
  let groupdesc =  this.groupInput.get('groupDesc').value
  let modifiedby ="test"
  let groupid = this.groupInput.get('groupid').value
  this.http.put(`${apiURL}/admin/groupmaster/updaterecordgroup`,{
    "groupname":groupname,
    "groupdesc":groupdesc,
    "modifiedby":modifiedby,
    "id":groupid
 })
 .subscribe((result)=>{
   console.log(result)
   alert("record is updated successfully");
   this.ngOnInit();
   this.clear();
 },(error)=>{
   console.log(error);
   alert("error occured while updating record");
 })
 }

 enablesavebutton(){
   this.savedlabel=false;
 }

  save(){ 
    let groupName = this.groupInput.get('groupName').value;
    let groupDesc = this.groupInput.get('groupDesc').value;

    if(groupName !=null && groupDesc !=null && groupName !='' && groupDesc !=''){

    let groupid = this.groupInput.get('groupid').value
        if(groupid=="" || groupid==null){
          alert("we are inserting record")
          this.savegrouprecord()
        }else{
          alert("we are updating record")
          this.updategrouprecord()
        }
      }else{
        alert("please enter all required fields");
      }
  }

  clear(){
    this.groupInput.reset();
    this.savedlabel=true;
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
