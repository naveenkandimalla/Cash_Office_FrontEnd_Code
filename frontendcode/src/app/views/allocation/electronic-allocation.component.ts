// fetching credit file details the following are the paypoint details --140,264,136
// by using above paypoint id we can fetch the credit files which are genreated fror that point id

import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {TpaypointComponent} from './tpaypoint/tpaypoint.component';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { apiURL } from '../../_nav';
import { formatDate } from "@angular/common";
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
  templateUrl: 'electronic-allocation.component.html'
})
  export class ElectronicAllocationComponent {

    bsModalRef: BsModalRef;
    electronicInput:FormGroup;
    allocatedlabel:boolean=true;
    username:any;
    userid:any;
    creditfiles:any;
    receiptdetails:any;
    bankstmtdetails:any;

    constructor(private http:HttpClient,private modalService: BsModalService,
      private router:Router,
      private tokendetails:TokenStorageService){
      this.electronicInput = new FormGroup({
        paypointID: new FormControl('', Validators.required),
        creditFile: new FormControl('', Validators.required),
        receiptNo: new FormControl('', Validators.required),
        receiptPeriod: new FormControl({value:"", disabled: true}),
        statementNo: new FormControl(''),
        statementPeriod: new FormControl({value:"", disabled: true}),
        allocatedPeriod: new FormControl(''),
  
        // 2nd column - Auto-filled Fields
        paypointName: new FormControl({value:"", disabled: true}),
        creditFileAmount: new FormControl({value:"", disabled: true}),
        grossAmountReceipt: new FormControl({value:"", disabled: true}),
        grossAmountStatement: new FormControl({value:"", disabled: true}),
        
      });
    }

  

  ngOnInit(){
     this.getsessionvalues();
  }
   

  getsessionvalues(){
    this.username= this.tokendetails.getUsername();
    this.userid= this.tokendetails.getuserid();
   }

  // calling pop up for fetching tpaypoint details
  select:any;
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(TpaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
    this.select = result;
    console.log("this my data"+result[0].paypointid);
    console.log("this my data"+result[0].paypointname);  
    // use for  patch paypoint details
    this.patchpaypointname();
    this.getcreditfiledetails(result[0].paypointid);
    })
  }
   
  
  // patching the paypoint name 
 patchpaypointname(){
      this.electronicInput.patchValue({ 
        paypointID:this.select[0].paypointid,
        paypointName:this.select[0].paypointname
      })
   }
  

    
   // fetching credit file details  --140,264
  getcreditfiledetails(pp){    
     this.http.get(`${apiURL}/allocations/electronicallocations/creditfiles?paypointid=${pp}`).subscribe(result=>{ 
     console.log(result);
     this.creditfiles = result;
    if(this.creditfiles.length==0){
      alert("No credit file is generated for this paypoint id ")
    }
    if(this.creditfiles.length>0){
      this.getreceiptdetails(result[0].paypointid);
      this.getstmtdetails(result[0].paypointid);
    }

      },(error)=>{
        console.log(error);
        alert("error occured while fetching the credit file details");
        }
      );
    }

    // fetching the recepit details 
  getreceiptdetails(paypoint){
      this.http.get(`${apiURL}/allocations/electronicallocations/recepitdetails?paypointid=${paypoint}`).subscribe(result=>{
        console.log(result);
        this.receiptdetails = result
        if(this.receiptdetails.length>0){
          this.allocatedlabel=false;
        }
       },(error)=>{
         console.log(error);
         alert("error occured while fetching results");
       }
         );
     }


 // fetchinh statement details     
getstmtdetails(paypoint){
      this.http.get(`${apiURL}/allocations/electronicallocations/bankstmtdetails?paypointid=${paypoint}`).subscribe(result=>{
      console.log(result)
      this.bankstmtdetails = result;
      console.log( this.bankstmtdetails);
      if(this.bankstmtdetails.length>0){
        this.allocatedlabel=false;
      }
       },(error)=>{
         console.log(error);
         alert("error occured while fetching the bank statement details");
       }
         );
     }
 

     // patching the credit amount based on credit file name 
     creditdetails(){
     let bbee =  this.electronicInput.get('creditFile').value      
     let desc = this.creditfiles.filter(app => app.filename == bbee );
     if(desc.length != 0 ){
         this.electronicInput.patchValue({
               creditFileAmount: desc[0].amount
           });
      }
      let crhhdriddetails = desc[0].crhhdrid
     }

     //used for patching the receipt details
     recepitdetails(){
      let bbee =  this.electronicInput.get('receiptNo').value
      let desc = this.receiptdetails.filter(app => app.receiptno == bbee );  

      if(desc.length != 0 ){

        const format = 'yyyy-MM-dd';
        const locale = 'en-US';
        let formattedDate = formatDate(desc[0].period, format, locale);

        this.electronicInput.patchValue({
          grossAmountReceipt: desc[0].amount,
          receiptPeriod:formattedDate
        }
        );
      }
     }


  allocate(){ 
     let paypointid = this.electronicInput.get('paypointID').value
     let  paypointname =this.electronicInput.get('paypointName').value
     let creditfilename = this.electronicInput.get('creditFile').value
     let creditamount = this.electronicInput.get('creditFileAmount').value
     let receiptnum= this.electronicInput.get('receiptNo').value
     let  receiptamount= this.electronicInput.get('grossAmountReceipt').value
     let  receiptperiod= this.electronicInput.get('receiptPeriod').value
     let allocatedperiod= this.electronicInput.get('allocatedPeriod').value
     
      if(paypointid == '' || paypointid == null || paypointid == 'undefined' || creditfilename == '' || creditfilename == null || receiptnum == '' || receiptnum == null || allocatedperiod == '' || allocatedperiod == null ){
           if(paypointid == ''){
             alert("No paypoint is selected")
           }

           if( creditfilename == ''){
             alert("No creditfile is selected ")
           }

           if(receiptnum == '' ){
             alert("please select the receipt number ")
           }

           if(allocatedperiod == ''){
             alert("please select the allocated period")
           }
      }else{
       
      let crhdrid = this.creditfiles[0].crhhdrid;
      let paypoint_id = this.electronicInput.get('paypointID').value;
      let period = this.electronicInput.get('receiptPeriod').value;
      let receiptnum= this.electronicInput.get('receiptNo').value;
      let creditamount = this.electronicInput.get('creditFileAmount').value;
      let flag;
      if(receiptnum=='' || receiptnum==null || receiptnum==undefined){
           flag = 'S';
      }else{
        flag = 'R';
      }

      this.getalloctionamount(crhdrid,paypoint_id,period,receiptnum,creditamount,flag);
      }

      
  }

  getalloctionamount(crhdrid,paypointid,period,receiptnum,receiptamount,flag){

    this.http.post(`${apiURL}/allocations/electronicallocations/allocated?updatedby=${this.userid}`,{

      "crhdrid":crhdrid,
      "paypointid":paypointid,
      "period":period,
      "receiptno":receiptnum,
      "receiptamount":receiptamount,
      "flag":flag
    }).subscribe((result)=>{
      console.log(result);
      let esoallocation:any = result;
      alert(esoallocation.fileresponse);
    },(error)=>{
      console.log(error);
    })

  }

  clear(){
   // window.location.reload() ;
   this.electronicInput.reset();
   this.allocatedlabel=true;
   this.ngOnInit();
  }

  exit(){
    window.location.href = "http://localhost:4200/#/dashboard" ; 
  }
  

}
