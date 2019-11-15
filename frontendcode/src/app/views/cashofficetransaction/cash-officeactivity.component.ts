
import { Component, NgModule, ɵConsole } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createactivity } from './createactivity.interface';
import { DatePipe } from '@angular/common';
import { apiURL } from '../../_nav';
import { $ } from 'protractor';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'cash-officeactivity.component.html',
  providers: [DatePipe]
})

export class cashofficeactivityComponent {
  TillcashierDetails: any;
  obj: any;
  seniorCashierYn: any;
  activityIDDetails: any;
  authorizeTillCashier: any;
  activity: any;
  userCashOffDetails: any;
  buttonDisabled: boolean;
  buttonDisabled1: boolean;
  Activitydetails: any;
  loginId: any;
  userName:any;
  userId:any;
  data: any;
  userID: any;
  receiptdate: any;
  createactivity: FormGroup;
  activityDetails: any;
  cashierActivityId: any;
  tillActivityStatus: any;
  func: any;
  checkactivity: any;
  TillDetails: any;

  constructor(private http: HttpClient, private router:Router,
    private tokendetails:TokenStorageService) {
    this.createactivity = new FormGroup(
      {
        cashOffActivityId: new FormControl(''),
        cashOfficeCode: new FormControl(''),
        branchCode: new FormControl(''),
        receiptDate: new FormControl(''),
        cashierCode: new FormControl(''),
        cashierName: new FormControl(''),
        loginId: new FormControl(''),
        tillActivityStatus: new FormControl(''),
        authorize: new FormControl(''),
        status: new FormControl(''),
        seniorCashierYn: new FormControl(''),
        cashierActivityId: new FormControl(''),
        cashierId: new FormControl('')
      }
    )
  }
  private fn: Function;

  ngOnInit() {
    // this.userName = sessionStorage.getItem('userName');
    // this.userId = sessionStorage.getItem('userID');
    this.userName =this.tokendetails.getUsername();


    //To get cashoffice data & check the cash office is opened or closed 
    this.http.get(apiURL + '/Checkactivity/' + JSON.stringify(this.userName))
      .subscribe(
        data => {
          this.checkactivity = data;
          console.log( this.checkactivity );
          if (this.checkactivity != null) {
            alert("cash Office is  closed for today");
            this.buttonDisabled = false;
            this.buttonDisabled1 = false;
          }
          else {
            //To check & patch the values if cash office is not closed                  
            this.http.get(apiURL + '/getActivitydetails/' + JSON.stringify(this.userName))
              .subscribe(
                data => {
                  this.Activitydetails = data;
                  console.log( this.Activitydetails );
                  //To get cashoffice details except activityId & checking the user is senior cashier or not.
                  if (this.Activitydetails == null) {
                    this.getUserActivitydetails();
                  } else {
                    this.createactivity.patchValue({
                      cashOffActivityId: this.Activitydetails[0].cashOffActivityId,
                      cashOfficeCode: this.Activitydetails[0].cashOfficeCode,
                      branchCode: this.Activitydetails[0].branchCode,
                      receiptDate: this.Activitydetails[0].receiptDate

                    })
                    this.buttonDisabled = false;
                  }
                  this.func();
                });

            //To get till cashier details & checking the till status is open or close
            this.func = function tillstatusCheck() {
              this.http.get(apiURL + '/tillActivitydetails/' + JSON.stringify(this.userName))
                .subscribe(
                  (response: any) => {
                    this.TillcashierDetails = response;
                    console.log( this.TillcashierDetails );
                    if (this.TillcashierDetails == null) {
                      // alert("till closed");
                    } else {
                      if (this.TillcashierDetails[0].tillActivityStatus == 'C') {
                        this.TillDetails = false;
                      }
                      //patching the till cashier details                     
                      else {
                        this.TillDetails = true;
                        this.createactivity.patchValue({
                          cashierCode: this.TillcashierDetails[0].cashierCode,
                          loginId: this.TillcashierDetails[0].loginId,
                          branchCode: this.TillcashierDetails[0].branchCode,
                          tillActivityStatus: this.TillcashierDetails[0].tillActivityStatus,
                          authorize: this.TillcashierDetails[0].authorize,
                          cashierActivityId: this.TillcashierDetails[0].cashierActivityId
                        });
                      }
                    }
                  });
            }
          }
        })
  }

  // To get user details & checking user is senior cashier or not
  getUserActivitydetails() {
    this.http.get(apiURL + '/userActivityDetails/' + JSON.stringify(this.userName))  
      .subscribe(response => {
        this.userCashOffDetails = response;
        console.log( this.userCashOffDetails );
        if (this.userCashOffDetails == null) {
          alert("The user is NOT authorized to Open Cashoffice");
          this.buttonDisabled1 = false;
          this.buttonDisabled = false;
        }
        // else if (seniorCashierYn == 0) {
        //   alert("The user is NOT authorized to Open Cashoffice");

        // }
        else if (this.userCashOffDetails[0].seniorCashierYn != 1) {
          alert("The CashOffice is not assigned for this USER");
        }
           else if (this.userCashOffDetails != null) {
            this.createactivity.patchValue({
              cashOfficeCode: this.userCashOffDetails[0].cashOfficeCode,
              branchCode: this.userCashOffDetails[1].branchCode,
              receiptDate: this.userCashOffDetails[1].receiptDate,
              cashierId: this.userCashOffDetails[0].cashierId
            });
            this.buttonDisabled1 = false;
        //  alert("The user is NOT authorized to Open Cashoffice");
       }
      }
      );
  }

  //To generate the activity Id by click open button
  openactivity(createactivity) {
    this.buttonDisabled = false;
    this.getactivityID();
    //alert("opened the cash office")
    window.location.reload();
  }

  //closing the cash office by clicking close button 
  close(createactivity) {
    if (this.TillcashierDetails == null) {
     // console.log("no till cashiers ")
    } else {
      window.location.reload();
      for (var i = 0; i < this.TillcashierDetails.length; i++) {
        this.data = this.TillcashierDetails[i].tillActivityStatus;
      }
    }
    if (this.data == 'O') {
      alert("Please close the Till cashiers");
    } else {
      this.TillDetails = false;
      //closing the cash office 
      this.http.post(apiURL + '/closeCashOffice/' + JSON.stringify(this.userName),
        this.createactivity.value).subscribe(response => {
        });
      this.buttonDisabled1 = false;
      this.clearForm();
      window.location.reload();
    }
  }
//Clear the form
  clear() {
    this.TillcashierDetails.reset();
    this.clearForm();
  }
  //Clear the form
  clearForm() {
    this.createactivity.setValue({
      cashOffActivityId: '',
      cashOfficeCode: '',
      branchCode: '',
      receiptDate: '',
      cashierCode: '',
      cashierName: '',
      loginId: '',
      tillActivityStatus: '',
      authorize: '',
      status: '',
      seniorCashierYn: '',
      cashierActivityId: '',
      cashierId: ''
    })
  }

  //To get ActivityId
  getactivityID() {
    this.http.post(apiURL + '/getActivityId',
      this.createactivity.value).subscribe(
        response => {
          this.activityIDDetails = response;
          let status = this.activityIDDetails.status;
          if (status == 'O') {
            this.createactivity.patchValue({
              cashOffActivityId: this.activityIDDetails.cashOffActivityId,
              receiptDate: this.activityIDDetails.receiptDate
            })
            this.buttonDisabled1 = true;
          } else {
            alert("previous cash office is closed");
          }
          alert("opened the cash office successfully");

        }, error => {
          alert("Error while saving Activity Details" + " -> " + JSON.stringify(error));
        })
  }

  //To Authorize the till cashiers
  check(createactivity) {
    this.TillDetails = true;
    var det = eval(this.TillcashierDetails);
    for (var i = 0; i < this.TillcashierDetails.length; i++) {
      this.obj = this.TillcashierDetails[i].cashierActivityId;
      this.http.post(apiURL + '/authorizeTillCashier/' + JSON.stringify(this.obj),
        this.createactivity.value).subscribe(
          response => {
            this.authorizeTillCashier = response;
            this.func();
          })
      if (this.TillcashierDetails[i].tillActivityStatus == 'C') {
      //  console.log(i);
      } else {
        break;
      }
    }
  }
}

