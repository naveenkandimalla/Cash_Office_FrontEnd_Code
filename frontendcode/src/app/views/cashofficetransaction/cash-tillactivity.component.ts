//import {Component, Injectable} from '@angular/core';
import { Component, NgModule, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'cash-tillactivity.component.html'
})
export class CashTillComponent {
  tillDetails: any;
  tillDetails1: any;
  userID: any;
  userName:any;
  userId:any;
  cashierdetails: any;
  buttonDisabled: boolean;
  buttonDisabled1: boolean;
  buttonDisabled2: boolean;
  tcashier: any;
  obj: any;
  tillStatus: any;
  checktillDetails: any;
  closeTillCashier:any;
  cashOfficeForm: FormGroup;

  constructor(private http: HttpClient, private router:Router,
    private tokendetails:TokenStorageService) {
    this.cashOfficeForm = new FormGroup({
      cashOffActivityId: new FormControl(''),
      cashierName: new FormControl(''),
      branchCode: new FormControl(''),
      cashOfficeId: new FormControl(''),
      branchName: new FormControl(''),
      receiptDate: new FormControl(''),
      cashOfficeDesc: new FormControl(''),
      status: new FormControl(''),
      tillActivityStatus: new FormControl(''),
      cashierId: new FormControl(''),
      cashierCode: new FormControl(''),
      cashierActivityId: new FormControl('')
    });
  }

//Page load
  ngOnInit() {  
    // this.userName = sessionStorage.getItem('userName');
    // this.userId = sessionStorage.getItem('userID');
    this.userName =this.tokendetails.getUsername();

   //To Check the Till, if user is closed the till or not 
    this.http.get(apiURL +'/CheckTillDetails/' + JSON.stringify(this.userName))
      .subscribe(response => {
        this.checktillDetails = response;
        if (this.checktillDetails != null) {
       let id=this.checktillDetails[0].cashierActivityId ;
      let status= this.checktillDetails[0].tillActivityStatus;
     let name= this.checktillDetails[0].cashierName;
          alert("till is already closed for today with an Activity ID :" +id
          +" and Till Status is :"+status +" and cashier is "+name); 
          this.buttonDisabled = false;
          this.buttonDisabled1 = false;
          this.buttonDisabled2 = false;
        }
        else {
    //To get TillStatus and Check status close or open     
          this.http.get(apiURL +'/CheckTillStatus/'+ JSON.stringify(this.userName))
          .subscribe(response => {
            this.tillStatus = response;
              //To get Till Activity details based on cash office status 
            if(this.tillStatus == null || this.tillStatus[0].tillActivityStatus == 'C'){         
              this.http.get(apiURL +'/TillDetails/' + JSON.stringify(this.userName))
              .subscribe(response => {
                this.tillDetails = response;
                if (this.tillDetails == null || this.tillDetails[0].status == 'C') {
                  alert("cash office is not opened");
                  this.buttonDisabled = false;
                  this.buttonDisabled1 = false;
                  this.buttonDisabled2 = false;
                } else {
                  console.log(this.tillDetails[0].branchCode);
                  this.cashOfficeForm.patchValue({                  
                    cashierName: this.tillDetails[0].cashierName,
                    branchName: this.tillDetails[0].branchName,
                    receiptDate: this.tillDetails[0].receiptDate,
                    cashOfficeDesc: this.tillDetails[0].cashOfficeDesc, 
                    status: this.tillDetails[0].status,
                    branchCode: this.tillDetails[0].branchCode,
                    cashOfficeId: this.tillDetails[0].cashOfficeId,
                    cashierId: this.tillDetails[0].cashierId,
                    cashierCode: this.tillDetails[0].cashierCode,
                    cashOffActivityId: this.tillDetails[0].cashOffActivityId,
                   
                  })
                  this.buttonDisabled2 = false;
                }
              });
            } 
          
            else{
        //To Get Cash Office Status and patch the Till Activity values and patch the values if status is opne      
              this.http.get(apiURL +'/TillDetails/' + JSON.stringify(this.userName))
              .subscribe(response => {
                this.tillDetails = response;
                if (this.tillDetails == null) {
                  alert("cash office is not opened");
                } else {
                  this.cashOfficeForm.patchValue({
                    cashierActivityId: this.tillDetails[0].cashierActivityId,
                    cashierName: this.tillDetails[0].cashierName,
                    branchName: this.tillDetails[0].branchName,
                    receiptDate: this.tillDetails[0].receiptDate,
                    cashOfficeDesc: this.tillDetails[0].cashOfficeDesc,
                    status: this.tillDetails[0].status,
                    branchCode: this.tillDetails[0].branchCode,
                    cashOfficeId: this.tillDetails[0].cashOfficeId,
                    cashierId: this.tillDetails[0].cashierId,
                    cashierCode: this.tillDetails[0].cashierCode,
                    cashOffActivityId: this.tillDetails[0].cashOffActivityId,
                    tillActivityStatus: this.tillDetails[0].status
                  })
                  this.buttonDisabled1 = false;
                }
              });
            }
          })
        }
      })
  }

  //To open the Till Activity
  openTillActivity(cashOfficeForm) {
    this.http.post(apiURL +'/Tillactivity',
      this.cashOfficeForm.value).subscribe(
        response => {
          this.tillDetails1 = response;
          var text = ' open';
          this.cashOfficeForm.patchValue({
            tillActivityStatus: text,
            cashierActivityId: this.tillDetails1.cashierActivityId
          })
          this.buttonDisabled1 = false;
          alert("Till Activity Details saving is successfully Created/Updated");
          window.location.reload();
        }, error => {
          alert("Error while saving Till Activity Details" + " -> " + JSON.stringify(error));
        }) 
  }
//To close the till Activity Cashier
  closeTillActivity(value){
    this.http.post(apiURL +'/authorizeTillCashier/' + JSON.stringify(value),
    this.cashOfficeForm.value).subscribe(
      response => {
        this.closeTillCashier = response; 
        this.cashOfficeForm.patchValue({
          tillActivityStatus: this.closeTillCashier.status   
        })
      })
      alert("closed the till cashier");
     this.buttonDisabled2 = false;
  }
 
  clear() {
    this.buttonDisabled1 = true;
  }
}


