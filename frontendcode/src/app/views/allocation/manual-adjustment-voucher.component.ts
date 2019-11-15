// Manual Adjustment Voucher - Allocation Module
// sample data can be found in that same screen
// policycode : 4007552269,4007552162,4007552188  
// sample data for BOBI is 60962,64308,62000
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { AllocationsService } from "./allocations.service";
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams} from '@angular/common/http';
import{BiboComponent} from './bibo/Bibo.component'
import { formatDate } from "@angular/common";
import { apiURL } from '../../_nav';
import { PagerService, GlobalServices } from './../../services/index';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators
]
})

@Component({
  templateUrl: './manual-adjustment-voucher.component.html'
})
export class ManualAdjustmentVoucherComponent{

  bsModalRef: BsModalRef;
  today = new Date() ; 
  newTransInput:FormGroup;
  postingdetails:any;
  formattedDate:any;
  select:any;
  intcashofficearray:any=[];
  postlabel:boolean=true;
  username:any;
  userid:any;
  pager: any = {};
  pagedItems: any[];

constructor(private http1: HttpClient,
             private modalService: BsModalService, 
             private pms:AllocationsService ,private pagerService: PagerService
             ,private router:Router,
             private tokendetails:TokenStorageService){  
      this.newTransInput = new FormGroup({
        policyCode: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
        period: new FormControl('', Validators.required),
        transType: new FormControl('', Validators.required),
        comments: new FormControl('', Validators.required),
        bnkStmtNo: new FormControl('',Validators.required),
        maualadjvouncherid: new FormControl('') 
      });
   }

   ngOnInit() { 
    this.getreadingpostingdetails();
    this.getsessionvalues();
  }


  // user login details
  getsessionvalues(){
    this.username= this.tokendetails.getUsername();
    this.userid= this.tokendetails.getuserid();
   }

// reading records for posting  details this is call as soon as page loads
getreadingpostingdetails(){
 this.pms.getpostingdetails().subscribe((bbb) =>{
 console.log(bbb);
 this.postingdetails = bbb;
 this.setPage(1);
  },(error) =>{
   alert("Problem with service. Please try again later!");
  }
);    
}



  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.postingdetails.length, page, 10);

    // get current page of items
    this.pagedItems = this.postingdetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


// fetching bank statement number  and patching the bank statement to new transcation
gettingRecordPostingFromCheckEvent(r){
  const format = 'yyyy-MM-dd';
  const locale = 'en-US';
  this.formattedDate = formatDate(r.period, format, locale);
  this.newTransInput.patchValue({  
    policyCode:r.policyCode,
    amount    : r.amount,
    period:this.formattedDate,   
    transType: r.adjTransactionType,
    comments: r.comments,
    bnkStmtNo: r.bobiRefNumber,
    maualadjvouncherid:r.manualAdjId
  }) 
  this.postlabel=false;       
 }

// this code is used for pop up screen for bank statement number which is used for saving the details
openModalWithComponent() {
this.bsModalRef = this.modalService.show(BiboComponent);
this.bsModalRef.content.closeBtnName = 'Close';
this.bsModalRef.content.onClose.subscribe(result => {    
this.select = result;
this.popupbobivalue();
  })
}
  
//reading the values from pop up and patching it 
popupbobivalue(){
  this.newTransInput.patchValue({
    bnkStmtNo:this.select
  })
} 


savingrecords(p){
let cashier= this.postingdetails.filter(app=>app.manualAdjId==p)
if(cashier.length != 0){
  let modifiedBy =this.username
   this.http1.put(`${apiURL}/allocations/manualadjustmentvoucher/unpostingstatus/updaterecord`,{
      "policyCode":this.newTransInput.value.policyCode,
      "adjTransactionType":this.newTransInput.value.transType,
      "period":this.newTransInput.value.period,
      "amount":this.newTransInput.value.amount,
      "comments":this.newTransInput.value.comments,
      "bobiRefNumber":this.newTransInput.value.bnkStmtNo,
      "modifiedBy":modifiedBy,
      "manualAdjId":this.newTransInput.value.maualadjvouncherid
     }).subscribe((result)=>{
       console.log(result);
       alert("record has been updated successfully");
       this.postlabel=false;  
     },(error)=>{
       console.log(error)
     })
}else{
  let createdby=this.username
  let postedby =this.username
  let modifiedBy =this.username
  this.http1.post(`${apiURL}/allocations/manualadjustmentvoucher/unpostingstatus/saverecord`,{
   "policyCode":this.newTransInput.value.policyCode,
   "adjTransactionType":this.newTransInput.value.transType,
   "period":this.newTransInput.value.period,
   "amount":this.newTransInput.value.amount,
   "comments":this.newTransInput.value.comments,
   "postingStatus":"UNPOSTED",
   "createdBy":createdby,
   "bobiRefNumber":this.newTransInput.value.bnkStmtNo,
   "postedBy":postedby,
   "modifiedBy":modifiedBy
   }).subscribe((result)=>{
       console.log(result);
       alert("record has been saved successfully");
       this.postlabel=false;  
  },(error)=>{
   console.log(error)
   })
   }
}

// this method will perform save operation insert record into interface table
insertrecordinterfacetable(){
let createdby=this.username;
this.http1.post(`${apiURL}/allocations/manualadjustmentvoucher/insertrecordinterfacetable`,{
     "policyCode":this.newTransInput.value.policyCode,
     "adjTransactionType":this.newTransInput.value.transType,
     "period":this.newTransInput.value.period,
     "amount":this.newTransInput.value.amount,
     "createdBy":createdby,
     "bobiRefNumber":this.newTransInput.value.bnkStmtNo,
}).subscribe((result)=>{
  console.log(result);
 
  this.updatingpostingstatus();
  },(error)=>{
      console.log(error);
    })
}
 
updatingpostingstatus(){
let postedby=this.username;
this.http1.post(`${apiURL}/allocations/manualadjustmentvoucher/updatingpostingstatus`,{
     "postedBy":postedby,
     "postingStatus":"POSTED",
     "manualAdjId":this.newTransInput.value.maualadjvouncherid
    }).subscribe((result)=>{
      console.log(result);
      alert("record has been  successfully posted");
      //alert("record has been successfully updated");
    },(error)=>{
      console.log(error);
    })
 }
 
 
 // now upedating or saving the record
postingrecords(p){ 
   let cashier= this.postingdetails.filter(app=>app.manualAdjId==p)
    if(cashier.length != 0){
     this.insertrecordinterfacetable();
    } else{
      alert("Record is not saved/not avaliable So it cannot be posted");
    }
 }

  
clear(){

  this.newTransInput.reset();
  this.formattedDate=null;
  this.select=null;
  this.intcashofficearray=[];
  this.postlabel=true;

  this.ngOnInit();
  }

exit(){   
  window.location.href = "http://localhost:4200/#/dashboard" ; 
 }

post(p){
  this.postingrecords(p);
}

save(s){
   this.savingrecords(s);
}
  

}
