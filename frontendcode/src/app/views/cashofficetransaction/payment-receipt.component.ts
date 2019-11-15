// Payment Receipt Component - Transactions Module

import { Component, NgModule } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiURL } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { PolicyComponent } from "./policy/policy.component";
import { CashofficeTransactionService } from "./cashofficetransaction.service";
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { formatDate } from '@angular/common';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@NgModule({
  imports: [
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'payment-receipt.component.html'
})
export class PaymentreceiptComponent {
  bsModalRef: BsModalRef;
  rcptDetails: any;
  co_ID: any;
  PayMethods: any;
  paymentDtls: boolean;
  selectedPolicy: any;
  userName: any;
  tillStatus:any;
  userId: any;
  cashOfficeId: any;
  cashierId: any;
  appDtls: any;
  appD_TPOL: any;
  appD_ACL: any;
  appD_GPL: any;
  appD_UPR: any;
  appD_TPP: any;
  appD_SUN: any;
  bankNames: any;
  branchNames: any;
  correction: any;
 // form groups for applications
   myFormTPOL:FormGroup;
   myFormACL: FormGroup;
   myFormGPL: FormGroup;
   myFormTPP: FormGroup;

   totalAmountTPOL:any=0;
   totalAmountACL:any=0;
   totalAmountGPL:any=0;
   totalAmountTPP:any=0;

   tpollabel:boolean=true;
   acllabel:boolean=false;
   gpllabel:boolean=false;
   tpplabel:boolean=false;
  
  constructor(private http: HttpClient, private gs: GlobalServices, private fb: FormBuilder,
              private modalService: BsModalService, private ctservice: CashofficeTransactionService, private router:Router,
              private tokendetails:TokenStorageService) { }
  
    receiptDetails = new FormGroup({
    paymentMethod: new FormControl('', Validators.required),
    cashOffice: new FormControl({ value: '', disabled: true }),
    receiptAmount: new FormControl('', Validators.required),
    receiptNumber: new FormControl({ value: '', disabled: true }, Validators.required),
    receivedFrom: new FormControl('', Validators.required),
    tillActivityStatus: new FormControl(''),
    cashierName: new FormControl({ value: '', disabled: true }),
    postedStatus: new FormControl({ value: '', disabled: true }),
    receiptDate: new FormControl({ value: '', disabled: true })
  });

  paymentDetails = new FormGroup({
    bankName: new FormControl('', Validators.required),
    drawee: new FormControl('', Validators.required),
    referenceNumber: new FormControl('', Validators.required),
    branchName: new FormControl('', Validators.required),
    referenceDate: new FormControl('', Validators.required)
  });

  receiptApplications = new FormGroup({
    corPeriod: new FormControl('', Validators.required),
    corPolicyCode: new FormControl('', Validators.required),
    corPayerName: new FormControl('', Validators.required),
    corStatus: new FormControl('', Validators.required),
    corArrears: new FormControl('', Validators.required),
    corExpectedAmount: new FormControl('', Validators.required)
  });

  //Page Load
  ngOnInit() {

    this.userName =this.tokendetails.getUsername();
    // code for tpol
    this.myFormTPOL = this.fb.group({
        correctionFormsTPOL: this.fb.array([])
    });
     // ACL
     this.myFormACL = this.fb.group({
      correctionACL: this.fb.array([])
    });
    // gpl
    this.myFormGPL = this.fb.group({
      correctionsGPL: this.fb.array([])
    });
    // TPP
      this.myFormTPP = this.fb.group({
        correctionsTPP: this.fb.array([])
      });
   

    this.http.get(apiURL +'/CheckTillStatus/'+ JSON.stringify(this.userName))
    .subscribe(response => {
      this.tillStatus = response;
      console.log("checking the till status--->" +this.tillStatus);
   
    if (this.userName != null && this.tillStatus != null) {
      this.co_ID = this.tillStatus[0].cashOfficeId;
      console.log("cashoffice id --->"+this.co_ID);
      this.http.get(apiURL + `/PRPayMethods?Id=${this.co_ID}`).subscribe(
        (response) => {
          this.PayMethods = response;
          console.log(this.PayMethods);
        }
      );
       
      this.paymentDtls = true;
      this.cashierId=this.tillStatus[0].cashierId;
      console.log(this.cashierId);
      this.getRcptDetails(this.cashierId);

      //FILL BANK DETAILS
      this.http.get(apiURL + `/getBankDtls`).subscribe(
        (response) => {
          this.bankNames = response;
          console.log( this.bankNames);
        }
      );

      this.http.get(apiURL + `/getApplicationDtls`).subscribe(
        (response) => {
          this.appDtls = response;
          console.log(this.appDtls);
          // this.appD_TPOL = this.appDtls.filter(app => app.appCode == "TPOL");
          // this.appD_ACL = this.appDtls.filter(app => app.appCode == "ACL");
          // this.appD_GPL = this.appDtls.filter(app => app.appCode == "GPL");
          // this.appD_UPR = this.appDtls.filter(app => app.appCode == "UPR");
          // this.appD_TPP = this.appDtls.filter(app => app.appCode == "TPP");
          // this.appD_SUN = this.appDtls.filter(app => app.appCode == "SUN");
        }
      );
    }
    else{
      alert("Till Activity not opened");
    }
  }) 
  }

  //To get the Receipt details
  getRcptDetails(Id) { 
    this.http.get(apiURL + `/getPayRcptDtlsWithID?Id=${Id}`).subscribe(
          (response) => {
            this.rcptDetails = response
            console.log( this.rcptDetails);
            if (this.rcptDetails.length > 0) {
              this.receiptDetails.patchValue({
                cashOffice: this.rcptDetails[0].cashOffCode,
                cashierName: this.rcptDetails[0].cashierName,
                co_ID: this.rcptDetails[0].cashOffId,
                postedStatus: "UNPOSTED",
                receiptDate: formatDate(new Date(), 'dd/MM/yyyy', 'en')
              });
            } else {
              alert("Please Open the Cash Till Activity");
            }   
          }, (error) => {
            alert("Did not find Receipt Details with given input parameters");
            console.log(error);
          }
        );
    
      }
  

  // TPOL
 
  get correctionFormsTPOL() {
    return this.myFormTPOL.get('correctionFormsTPOL') as FormArray
  }

    addCorrectionTPOL() {
      const correctionForms = this.fb.group({ 
        appActCode: [],
        corPeriod: [],
        corPolicyCode: [],
        corStatus: [],
        corPayerName: [],
        corArrears: [],
        corExpectedAmount: [],      
        corAllocatedAmount: [] 
      })
      this.correctionFormsTPOL.push(correctionForms);
    }


    deleteCorrectionTPOL(i) {
      this.correctionFormsTPOL.removeAt(i)
    }


  // ACL
  get correctionFormsACL() {
    return this.myFormACL.get('correctionACL') as FormArray
  }
  addCorrectionACL() {

    const correction = this.fb.group({
      aclActivity: [],
      aclDescription:[],
      aclPeriod: [],
      aclDealNumber:[],
      aclAllocatedAmount: []
    })

    this.correctionFormsACL.push(correction);
  }

  deleteCorrectionACL(i) {
    this.correctionFormsACL.removeAt(i)
  }


  // GPL
  get correctionFormsGPL() {
    return this.myFormGPL.get('correctionsGPL') as FormArray
  }

  addCorrectionGPL() {

    const correction = this.fb.group({

      gplActivity: [],
      gplDescription: [],
      gplPeriod: [],
      gplAllocatedAmount: []
    })

    this.correctionFormsGPL.push(correction);
    }
  
  deleteCorrectionGPL(i) {
    this.correctionFormsGPL.removeAt(i)
  }

  // TPP
  get correctionFormsTPP() {
    return this.myFormTPP.get('correctionsTPP') as FormArray
  }
 
  addCorrectionTPP() {

    const correction = this.fb.group({
      tppActivity: [],
      tppActivityDesc: [],
      tppPeriod: [],
      tppPaypoint:[],
      tppGrossAmount: [],
      tppReceiptedAmount: []
    })

    this.correctionFormsTPP.push(correction);
  }

  deleteCorrectionTPP(i) {
    this.correctionFormsTPP.removeAt(i)
  }

  onBankChange(val) {
    this.http.get(apiURL + `/getBankBranchDtls?Id=${val}`).subscribe(
      (response) => {
        this.branchNames = response;
      }
    );
  }

  onChange(val) {
    if (val != 2) {
      this.paymentDtls = false;
    }
    else {
      this.paymentDtls = true;
    }
  }

  togglepaymentDtls() {
    this.paymentDtls = !this.paymentDtls;
  }

  //pop up screen for given Policy code
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(PolicyComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
    this.selectedPolicy = result[0];
      
    })
  }
 




 
  


//Clear the form
  clear() {
    this.myFormTPOL.reset();
    this.myFormACL.reset();
  }

  //To save the receipt details the following data will be saved in two tables T_RCPT_ALLOCATION,t_receipt
  save() {
    this.http.post(apiURL + '/InsertRcptDtls',
      {
        "rcptAmount": this.receiptDetails.value.receiptAmount,
        "rcvdFrom": this.receiptDetails.value.receivedFrom,
        "payMtdId": this.receiptDetails.value.paymentMethod,
        "cashOffId": this.co_ID,
        "cashierId": this.cashierId,
        "creatBy": this.userName,
        "appId": this.appDtls.appId,
        "allocAmt": this.myFormTPOL.value.corAllocatedAmount,
        "unallocAmt": 0.0
      }).subscribe(
        (response) => {
          alert("record has been inserted with an Id :" + response);
          this.receiptDetails.patchValue({
            receiptNumber: response
          });
        }, (error) => {
         // console.log(error);
        }
      );
  }
}
