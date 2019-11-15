// Page Access Master - Admin Module 

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams} from '@angular/common/http';
import { PagerService, GlobalServices } from './../../services/index';
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
  templateUrl: 'page-access.component.html'
})
export class PageAccessComponent {

  pageInput = new FormGroup({
    screenCode: new FormControl('', Validators.required),
    screenDesc: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    application: new FormControl('', Validators.required),
    stauts:  new FormControl('', Validators.required),
    moduleid:  new FormControl('', Validators.required),
    pageaccessid:new FormControl('', Validators.required)
  }) ;

  pagerole = new FormGroup({
    screenCode1: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    enable:  new FormControl('', Validators.required),
    pageaccessid1:new FormControl('', Validators.required),
    pageaccessroleid:new FormControl('')
  }) ;


  constructor(private http: HttpClient,private pagerService: PagerService,private adminservice: AdminService){
  }

  ngOnInit() {
    this.getmoduledetails();
    this.getpageaccessmasterdetails();
  }


  pager: any = {};
  pagedItems: any[];
  displayPageAccess = false;
  PageAccessmaster=true;
  moduledetails:any;
  pageaccessmaster:any;
  showroleslabel:boolean=true;
  savelabel:boolean=true;
  
   // fetch tmodule details
  getmoduledetails(){
    this.http.get(`${apiURL}/admin/PageAccessMaster/ModuleDetails`).subscribe((result)=>{
    console.log(result);
    this.moduledetails=result;
     },(error)=>{
       console.log(error);
       alert("error occured while fetching module details");
     })
  }

   // fetch pageaccessmaster details [info related to page access] 
  getpageaccessmasterdetails(){
    this.http.get(`${apiURL}/admin/PageAccessMaster/tpageaccessmaster`).
    subscribe((result)=>{
      console.log(result);
      this.pageaccessmaster=result;
      this.setPage(1);
    },(error)=>{
      console.log(error)
    })
 }

  // setting the pagination for pageaccessmaster details
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.pageaccessmaster.length, page, 10);
    // get current page of items
    this.pagedItems = this.pageaccessmaster.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  

//patching pageaccess details
  patchnewgroupdetails(pam){
  let moduleid = pam.moduleid
  let applicationcode = this.moduledetails.filter(app => app.moduleid == moduleid ) 
  this.pageInput.patchValue({
    screenCode:pam.screenCode,
    screenDesc:pam.screenDesc,
    url:pam.url,
    application:applicationcode[0].moduledesc,
    pageaccessid:pam.pageaccessId
  })
  this.savelabel=false;
  this.showroleslabel=false;
  }

  // save the record into tpageaccessmasterauthority
  save(){
    let pageaccessid = this.pageInput.get('pageaccessid').value;
    
    let screencode= this.pageInput.get('screenCode').value;
    let screendesc = this.pageInput.get('screenDesc').value;
    let url = this.pageInput.get('url').value;
    let moduledescription = this.pageInput.get('application').value;
    //let moduleiddetails = this.moduledetails.filter(app => app.moduledesc ==  moduledescription); 
    //let moduleid = moduleiddetails[0].moduleid

    if(screencode != null && screendesc != null && url != null && moduledescription !=null && screencode != '' && screendesc != '' && url != '' && moduledescription !='' ){


   if(pageaccessid=="" || pageaccessid==null){
     alert("we are inserting the record");
     this.savepageaccessmaster();
   }else{
     alert("we are updating the record")
     this.updatepageaccessmaster();
   }

  }else{

    alert("fields cannot be empty");

  }
  }

// inserting the record into pageaccessmaster
pageaccessidgernerated:any
 savepageaccessmaster(){
  let screencode= this.pageInput.get('screenCode').value;
  let screendesc = this.pageInput.get('screenDesc').value;
  let url = this.pageInput.get('url').value;

  if(this.pageInput.get('stauts').value == null || this.pageInput.get('stauts').value == false || this.pageInput.get('stauts').value == '')  { 
    this.pageInput.controls['stauts'].setValue(0);
   } else {
      this.pageInput.controls['stauts'].setValue(1);
 }
 
 let moduledescription = this.pageInput.get('application').value;
 let moduleiddetails = this.moduledetails.filter(app => app.moduledesc ==  moduledescription); 
 let moduleid = moduleiddetails[0].moduleid
 let status = this.pageInput.get('stauts').value;
 let createdBy ="test"
 let enabled;
 if(status=="1"){
     enabled ="o";
  }else{
   enabled="c";
  }
  this.http.post(`${apiURL}/admin/PageAccessMaster/insertrecordpageaccesmaster`,{
   "screenCode":screencode,
   "screenDesc":screendesc,
   "url":url,
   "moduleid":moduleid,
   "status":enabled,
   "createdBy":createdBy
  }).subscribe((result)=>{
    console.log(result)
    this.pageaccessidgernerated=result;
    alert("record is saved sucessfully");
    this.showroleslabel=false;
  },(error)=>{
    console.log(error);
    alert("error occured while inserting the record");
  })

 }

 //updating the record
 updatepageaccessmaster(){
  let moduleidformgroup= this.pageInput.get('moduleid').value;
  let screencode= this.pageInput.get('screenCode').value;
  let screendesc = this.pageInput.get('screenDesc').value;
  let url = this.pageInput.get('url').value;

  if(this.pageInput.get('stauts').value == null || this.pageInput.get('stauts').value == false || this.pageInput.get('stauts').value == '')  { 
    this.pageInput.controls['stauts'].setValue(0);
   } else {
      this.pageInput.controls['stauts'].setValue(1);
   }

   let moduledescription = this.pageInput.get('application').value;
   let moduleiddetails = this.moduledetails.filter(app => app.moduledesc ==  moduledescription); 
   let moduleid = moduleiddetails[0].moduleid
   let status = this.pageInput.get('stauts').value;  
   let modifiedby ="tester";
   let enabled;
   if(status=="1"){
      enabled ="o";
   }else{
    enabled="c";
   }
   let pageaccessid = this.pageInput.get('pageaccessid').value;

   this.http.put(`${apiURL}/admin/PageAccessMaster/updaterecordpageaccesmaster`,{
    "screenCode":screencode,
    "screenDesc":screendesc,
    "url":url,
    "moduleid":moduleid,
    "status":enabled,
    "modifiedBy":modifiedby,
    "pageaccessId":pageaccessid  
  }).subscribe((result)=>{
    console.log(result)
    alert("recored has updated successfully");
    this.showroleslabel=false;
  },(error)=>{
    console.log(error);
    alert("error occured while updating the record");
  })
 }

 enablesavelabel(){
  this.savelabel=false;;
 }

// dealing with pageaccess to role

clear(){
  this.pageInput.reset() ;
  this.savelabel=true;
  this.showroleslabel=true;
}


changeRoles(){
    this.displayPageAccess = true;
    this.PageAccessmaster=false; 
    let pageaccessid =  this.pageInput.get('pageaccessid').value;
    this.pagerole.controls['pageaccessid1'].setValue(pageaccessid);
    this.fetchroledetails(); 
    this.getpageaccessauthoritybyusingaccessid();
    this.getinitialpageroledetails();
  }

  
  exitinitially(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }


  // below code deals with assaining role details.............................................

// fetching roleid and role name details
roledetails:any;
fetchroledetails(){
  this.adminservice.getallroledetails().subscribe((result) =>{
   console.log(result);
   this.roledetails=result;
 },
 (error) =>{
      console.log(error)  
 });    
}

// get pageaccessauthority details using  pageaccess id
pageaccessdetails:any
screendescriptioncode:any;
  getpageaccessauthoritybyusingaccessid(){
    let pageaccessid =  this.pageInput.get('pageaccessid').value
    this.http.get(`${apiURL}/admin/PageAccessMaster/getpageaccesdetailsbypageaccesid?pageaccessid=${pageaccessid}`)
    .subscribe((result)=>{
    console.log(result)
    if(result==null || result=="null"){
         alert("there no role assign to this screen ")
       }else{
        this.pageaccessdetails=result
        if(this.pageaccessdetails.length==0){
          alert("there no role assign to this screen ")
        }
    let applicationcode = this.pageaccessmaster.filter(app => app.pageaccessId == pageaccessid) 
    this.screendescriptioncode=applicationcode[0].screenDesc
     }
      
    },(error)=>{
        console.log(error);
        alert("error occured while fetching record from pageaccessmaster");
    })
  }


  //patch the initial pageaccess role details so that we can access the page id
  getinitialpageroledetails(){
  let screencode = this.pageInput.get('screenCode').value
  let pageaccessid = this.pageInput.get('pageaccessid').value
  this.pagerole.patchValue({
    "screenCode1":screencode,
    "pageaccessid1":pageaccessid
    })
  }

  // we will patch role pageaccess id 
  patchnewroleassigndetails(p){
     this.pagerole.patchValue({
      "role":p.authority,
      "pageaccessroleid":p.pageaccessroleid
     })
  }

// we will have page access role id then we will update it 
  savepageaccesauthority(){
    let pageaccessroleid = this.pagerole.get('pageaccessroleid').value;
    let role = this.pagerole.get('role').value;


  if(role != null && role !=''){
      if(pageaccessroleid=="" || pageaccessroleid==null ){
         alert("record to be inserted");
         this.savepageaccessauthoritydetails();
      }else{
       alert("record to be updated")
      this.updatepageaccessauthorityrecord();
    }
}else{
  alert("fields cannot be empty");
}

  }


  savepageaccessauthoritydetails(){ 
     let screencode = this.pagerole.get('screenCode1').value;
     let role = this.pagerole.get('role').value;
     let pageaccessid = this.pagerole.get('pageaccessid1').value;
     if(this.pagerole.get('enable').value == null || this.pagerole.get('enable').value == false || this.pagerole.get('enable').value == '')  { 
      this.pagerole.controls['enable'].setValue(0);
     } else {
        this.pagerole.controls['enable'].setValue(1);
     }
     let status = this.pagerole.get('enable').value;
     let enabled;
     if(status=="1"){
        enabled ="o";
     }else{
         enabled="c";
     }
     let createdby ="test"
     this.http.post(`${apiURL}/admin/PageAccessMaster/insertpageaccessauthority`,{
      "pageaccessId":pageaccessid,
      "authority":role,
      "enabled":enabled,
      "createdBy":createdby
     }).subscribe((result)=>{
       console.log(result)
       alert("record is saved successfully");
     },(error)=>{
       console.log(error);
       alert("error occured while inserting the record ");
     })
  }


  updatepageaccessauthorityrecord(){
    let screencode = this.pagerole.get('screenCode1').value;
    let role = this.pagerole.get('role').value;
    let pageaccessid = this.pagerole.get('pageaccessid1').value;
    let pageaccessroleid = this.pagerole.get('pageaccessroleid').value;
 
  if(this.pagerole.get('enable').value == null || this.pagerole.get('enable').value == false || this.pagerole.get('enable').value == '')  { 
     this.pagerole.controls['enable'].setValue(0);
    } else {
       this.pagerole.controls['enable'].setValue(1);
    }
    let status = this.pagerole.get('enable').value;
    let enabled;
    if(status=="1"){
       enabled ="o";
    }else{
        enabled="c";
    }
    let modifiedby ="test"
    this.http.put(`${apiURL}/admin/PageAccessMaster/updaterecordpageaccessauthority`,{
      "pageaccessId":pageaccessid,
      "authority":role,
      "enabled":enabled,
      "modifiedBy":modifiedby,
      "pageaccessRoleId":pageaccessroleid

    }).subscribe((result)=>{
      console.log(result)
      alert("record is successfully updated");
    },(error)=>{
      console.log(error);
      alert("error occured while updating record");
    })

  }

  reset(){
    this.pagerole.get('role').reset();
    this.pagerole.get('enable').reset();
    this.pagerole.get('pageaccessroleid').reset();
    
  }

  exit(){
    this.displayPageAccess = false;
    this.PageAccessmaster=true;
    this.clear();
    // Re-direct to app landing page
  }

}
