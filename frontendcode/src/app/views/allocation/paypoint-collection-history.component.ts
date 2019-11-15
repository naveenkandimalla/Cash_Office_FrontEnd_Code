// we can have the sample data as the screen loads paypoint id = 34,132,136,138

import { Component,NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AllocationsService } from "./allocations.service";
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient, HttpParams} from '@angular/common/http';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PaypointComponent } from "./paypoint/paypoint.component"
import { PagerService, GlobalServices } from './../../services/index';
import { formatDate } from "@angular/common";
import { apiURL } from '../../_nav';
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
  templateUrl: './paypoint-collection-history.component.html'
})
export class PaypointCollectionHistoryComponent {
   
  detailInput:FormGroup;
  receiptDetail:FormGroup
  paypointDetails1:any;
  collectionhistory:any;
  User:any;
  bsModalRef:any;
  selectedPaypoint:any; 
  pager: any = {};
  pagedItems: any[];
  showDetail:boolean = false ;
  selectedItem12: any ; 
  paypoint_due:Date;
  receiptdetails:any;

  constructor(private allocationservice:AllocationsService,private fb: FormBuilder,private http:HttpClient,
    private modalService: BsModalService,private pagerService: PagerService,
    private router:Router,
    private tokendetails:TokenStorageService){

    this.detailInput = new FormGroup({
      paypointID: new FormControl(''),
      paypointName: new FormControl(''),
      field3: new FormControl('') 
    });
  
    this.receiptDetail = new FormGroup({
      collPeriod: new FormControl(''),
      receiptNo: new FormControl(''),
      rcptAmnt: new FormControl('') ,
      rcptDate: new FormControl('')
    });

  }


  ngOnInit() {  
   this.getpaypointname();
   this.getsessionvalues();
   }
   
   // user details
   getsessionvalues(){
     this.User= this.tokendetails.getUsername();
    }

   // getting paypoint details
   getpaypointname(){
    this.allocationservice.getPayPointDetails().subscribe(
    (response) => {
      console.log(response);
      this.paypointDetails1 = response;
    },
    (error) => {
      console.log(error);
      alert("Error at fetching paypoint details");
    }
    );  
  }
    
  // passing the paypoint details 
   
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(PaypointComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
    this.selectedPaypoint = result[0];       
    this.patchingpaypointdetails();
    // used to set value for 3rd variable  
    let cashier=this.paypointDetails1.filter(app => app.paypoint_id == this.selectedPaypoint.paypoint_id);
    if(cashier.length != 0){
       this.detailInput.patchValue({
            field3:cashier[0].pay_Point_Type_id   
        });
      }     

    this.getcollectionhistoryrecords(this.selectedPaypoint.paypoint_id);

    })
  
  }

// patching the paypoint details
  patchingpaypointdetails(){
    this.detailInput.patchValue({
      paypointID:this.selectedPaypoint.paypoint_id,
      paypointName:this.selectedPaypoint.payPoint_Name,
    })
  }


  // code used for fetching data from paypoint collection history 2nd stage
getcollectionhistoryrecords(ppi){
  this.allocationservice.getpaypointcollectionhistory(ppi).subscribe( 
    response => {
      this.collectionhistory = response;
      console.log(this.collectionhistory);
     if(this.collectionhistory==""){
         //below code is used for reseting the previous record data
         this.receiptDetail.reset(); 
         this.pagedItems=[];
         this.showDetail = false ;
        alert("No data has been Raised for this paypoint id");
     }else{
      console.log( this.collectionhistory);
      this.setPage(1);
     // this.showDetail = false ;
      //this.receiptDetail.reset(); 
     }
    },(error) => {
      console.log(error);
      alert("Error at fetching collectionhistory details");
    });
 }

  

setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
      return;
  }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.collectionhistory.length, page, 10);

    // get current page of items
    this.pagedItems = this.collectionhistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


 
  onSelect(x){
    this.selectedItem12 = x ;
    console.log("this details paypoint_due_date -------->"+this.selectedItem12.paypoint_due_date);
    let datafromat = this.selectedItem12.paypoint_due_date
    const format = 'yyyy-MM-dd';
    const locale = 'en-IND';
    let formattedDate = formatDate(datafromat, format, locale);
    let ppid =  this.selectedPaypoint.paypoint_id
    this.getrecepitdetails(ppid,formattedDate)
    this.showDetail = true ;
    }

 // get recepit details 
getrecepitdetails(pp,pe){
  this.paypoint_due=pe
  this.allocationservice.getreceiptdetails(pp,pe).subscribe((response) => {
  this.receiptdetails = response
  console.log(this.receiptdetails);
  if(this.receiptdetails[0] == undefined){
      alert("Receipt Details Not Avaliable For This PayPoint");
    this.showDetail = false ;
  }else{
    this.getpatchingreceiptdetails();
  }
  },(error) => {
    console.log(error);
    alert("Error at fetching Receipt details");
  });    
  }

  // patching the receipt details
  getpatchingreceiptdetails(){
  let collPeriod1 = this.selectedItem12.paypoint_due_date
  if( this.receiptdetails[0] == undefined){
   console.log("no data for the paypoint and coressponing date")
  } else{
    const format = 'yyyy-MM-dd';
    const locale = 'en-IND';
    let collectionperiod = formatDate(collPeriod1, format, locale);
    let rcptDate = this.receiptdetails[0].recepitdate
    let rcptDate1 = formatDate(rcptDate, format, locale);
    this.receiptDetail.patchValue({ 
    collPeriod: collectionperiod,
    receiptNo: this.receiptdetails[0].receiptno,
    rcptAmnt: this.receiptdetails[0].receiptamount,
    rcptDate: rcptDate1});
  }
}



  clear(){
    this.detailInput.reset();
    this.showDetail = false ;
    this.pagedItems=[];
  }

  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
    
  }

}