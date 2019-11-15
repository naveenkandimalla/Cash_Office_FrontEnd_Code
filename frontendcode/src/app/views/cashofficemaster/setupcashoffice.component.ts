import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { PagerService, GlobalServices } from './../../services/index';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';




@Component({
  templateUrl: 'setupcashoffice.component.html'
})
export class SetUpCashOfficeComponent {
  cashOfficeForm: FormGroup;
  assignApplicationForm: FormGroup;
  assignPayMethodForm: FormGroup;
  cashOffice: any;
  allBranches: any;
  currValue: any;
  pager: any = {};
  pagedItems: any[];
  showDiv: boolean;
  showAppDiv: boolean;
  showPayMethodDiv: boolean;
  assignedapps: any;
  applications: any;
  currApp: any;
  assignedpayMethods: any;
  paymentMethods: any;
  currPaymentMethod: any;
  userName:any;
  constructor(private http: HttpClient, private pagerService: PagerService, 
              private gs: GlobalServices,
              private router:Router,
                private tokendetails:TokenStorageService) {
    this.cashOfficeForm = new FormGroup({
      cashOfficeCode: new FormControl('', Validators.required),
      cashOfficeDesc: new FormControl('', Validators.required),
      branchCode: new FormControl('', Validators.required),
      branchName: new FormControl(),
      cashOfficeId: new FormControl()
    });
    this.assignApplicationForm = new FormGroup({
      cashOfficeCode: new FormControl(),
      applicationCode: new FormControl('', Validators.required),
      applicationDesc: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      appId: new FormControl('', Validators.required)
    });
    this.assignPayMethodForm = new FormGroup({
      cashOfficeCode: new FormControl(),
      pymtMethodCode: new FormControl('', Validators.required),
      pymtMethodDesc: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      payMethodId: new FormControl()
    });
  }
  //Page Load method
  ngOnInit() {
    this.mainPage();
    this.clearForm();
    this.http.get(apiURL +"/getCashOfficeDetails")
      .subscribe(response => {
        this.cashOffice = response;
        console.log(response);
        this.setPage(1);
      });
    this.gs.getBranches()
      .subscribe(data => {
        this.allBranches = data
      });
      
      this.userName =this.tokendetails.getUsername();
  }
  //Cancel Button click event
  mainPage() {
    this.showDiv = true;
    this.showAppDiv = false;
    this.showPayMethodDiv = false;
  }
  //executes when user click on assign application link in main screen
  showAssignApplication(value) {
    this.showDiv = false;
    this.showAppDiv = true;
    this.showPayMethodDiv = false;
    
    this.http.get(apiURL +"/getAppsAssignedToCO?CoCode=" + value)
      .subscribe(response => {
        this.assignedapps = response;
      });  
    this.assignApplicationForm.setValue({
      cashOfficeCode: value,
      appId :'',
      applicationCode: '',
      applicationDesc: '',
      startDate: '',
      endDate: ''
    });
    this.gs.getApplications()
      .subscribe(data => {
        console.log(data);
        this.applications = data;
      })
  }
  //Method to call Assign Paymentmethod link in Setup Cashoffice screen
  showAssignPayMethod(value) {
    this.showDiv = false;
    this.showAppDiv = false;
    this.showPayMethodDiv = true;
    this.http.get(apiURL + "/getPayMethodsAsgndToCO?CoCode=" + value)
      .subscribe(response => {
        this.assignedpayMethods = response;
      });
    this.assignPayMethodForm.setValue({
      cashOfficeCode: value,
      payMethodId: '',
      pymtMethodCode: '',
      pymtMethodDesc: '',
      startDate: '',
      endDate: ''
    });
    this.gs.getPaymentMethods()
      .subscribe(data => {
        this.paymentMethods = data;
      })
  }
  //Display Selected CashOffice Details  
  showDetails(value, e) {
    if (e.target.checked) {
      if (e.target.name == "coradio") {
        this.cashOfficeForm.setValue({
          cashOfficeCode: value.cashOfficeCode,
          cashOfficeDesc: value.cashOfficeDesc,
          branchCode: value.branchName,
          branchName: value.branchName,
          cashOfficeId: value.cashOfficeId
        });
      } else if (e.target.name == "appRadio") {
        this.assignApplicationForm.patchValue({
          applicationCode: value.applicationCode,
          applicationDesc: value.applicationDesc,
          startDate: this.gs.fromJsonDate(value.startDate),
          endDate:this.gs.fromJsonDate(value.endDate)
        });
      }else if(e.target.name=="asgnPmRadio"){
        this.assignPayMethodForm.patchValue({
          pymtMethodCode :value.pymtMethodCode,
          pymtMethodDesc: value.pymtMethodDesc,
          startDate: this.gs.fromJsonDate(value.startDate),
          endDate: this.gs.fromJsonDate(value.endDate)
        });
      }
    } else {
      this.clearForm();
    }
  }
  updateBranchName(event) {
    //this.allBranches.filter(app => app.abbrName == event.target.value);
    //console.log(this.allBranches.filter(app => app.abbrName == event.target.value)[0]);
    this.cashOfficeForm.patchValue({
      branchName:event.target.value
      //branchName: this.allBranches.filter(app => app.abbrName == event.target.value)[0].companyName
    });
  }
  updateAppDetails(event) {
    this.currApp = this.applications.filter(app => app.applicationCode == event.target.value);
   console.log(this.currApp);
    this.showAppDiv = true;
    //patchValue is used to update only some of the form fields [all this values are fetch from t_application table]
    this.assignApplicationForm.patchValue({
      cashOfficeCode: this.assignApplicationForm.controls["cashOfficeCode"].value,
      appId: this.currApp[0].appId,
      applicationDesc: this.currApp[0].applicationDesc,
      startDate: this.gs.fromJsonDate(this.currApp[0].startDate),  // here end date and start date is nothing but creation date of application
      endDate: this.gs.fromJsonDate(this.currApp[0].endDate)
    });
  }

  updatePayMethodDetails(event) {
    //filter is used to filter the array of objects based on a object property 
    this.currPaymentMethod = this.paymentMethods.filter(app => app.payMethodCode == event.target.value);
    //patchValue is used to update only some of the form fields
    this.assignPayMethodForm.patchValue({
      cashOfficeCode: this.assignPayMethodForm.controls["cashOfficeCode"].value,
      payMethodId: this.currPaymentMethod[0].payMethodId,
      pymtMethodDesc: this.currPaymentMethod[0].payMethodDesc,
      startDate: this.gs.fromJsonDate(this.currPaymentMethod[0].creationDate),
      endDate: this.gs.fromJsonDate(this.currPaymentMethod[0].creationDate)
    });
  }
  //Method to clear to Cash office Form details
  clearForm() {
    this.cashOfficeForm.setValue({
      cashOfficeCode: '',
      cashOfficeDesc: '',
      branchCode: '',
      branchName: '',
      cashOfficeId:''
    })
  }

  //To get the Cash office details
  search(value) {
    let coDet = this.cashOffice.filter(co => co.cashOfficeCode == value.toUpperCase());
    if (coDet.length == 0) {
      alert("No cashoffice exists with given code");
    } else {
      this.cashOfficeForm.patchValue({
        cashOfficeCode: coDet[0].cashOfficeCode,
        cashOfficeDesc: coDet[0].cashOfficeDesc,
        branchCode: coDet[0].branchCode,
        branchName: coDet[0].branchName
      });
    }

  }
  //Methos to show data in Pagenation 
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.cashOffice.length, page, 5);

    // get current page of items
    this.pagedItems = this.cashOffice.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  //To save the Cash Office Details 
  onCoSubmit() {
    console.log(this.cashOfficeForm.value);
    this.http.post(apiURL + `/createCashOffice?createdby=${this.userName}`, this.cashOfficeForm.value).
      subscribe((response) => {
        alert("successfully saved/updated cashoffice details");
         console.log(response);
        this.ngOnInit();
      }, (error) => {
        alert("failed to save/update cashoffice details");
        console.log(error);
      });
  }

  //To save the Assign Applications details to cash office 
  assignApplication(formValue) {  
    this.http.post(apiURL + `/assignAppToCashOffice?createdby=${this.userName}`, formValue.value)
      .subscribe(response => {
        if(response == null){
          alert("This Application code is already assigned to given CashOffice");
        }else{
        alert("Application successfully assigned to CashOffice");
        this.showAssignApplication(formValue.value.cashOfficeCode);
      }
    },error =>{
        alert("Error during assigning application to Cashoffice"); 
      })
 
  } 
  
  //To save the Payment Method  details to cash office 
  assignPaymentMenthod(formValue) {
    this.http.post(apiURL + `/asgnPaymentMethodToCO?createdby=${this.userName}`, formValue.value)
      .subscribe((response) => {
        if(response == null){
          alert("This payment method code is already assigned to given CashOffice");
        }else{
        alert("Payment method successfully assigned to CashOffice");
        this.showAssignPayMethod(formValue.value.cashOfficeCode);
        }
      },error =>{
        alert("Error during assigning payment method to Cashoffice"); 
      })
  }

}    
