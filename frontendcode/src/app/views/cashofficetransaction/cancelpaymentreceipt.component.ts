import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { apiURL } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
import {RequestOptions, Headers} from "@angular/http";
import { $ } from 'protractor';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';


@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule]
})

@Component({
  templateUrl: './cancelpaymentreceipt.component.html'
})
export class CancelpaymentReceiptComponent {
   
// ALLA CODE START ..
cashiers: any;
filteredCashiers :any;
rcptDtls: any;
filteredRcptDtls :any;
rcptDetails: any;
//recAllo: any;
obj: any;
obj1: any;
url: any;
pager: any = {};
pagedItems: any[];
receiptDetails: FormGroup;
receiptAllocation: FormGroup;
assignCashierForm: FormGroup;
receiptInput: FormGroup;
constructor(private http: HttpClient, 
           private pagerService: PagerService,
           private gs:GlobalServices,
           private router:Router,
           private tokendetails:TokenStorageService) { 
  this.assignCashierForm = new FormGroup({
    cashOfficeCode: new FormControl('', Validators.required),
    //cashierCode: new FormControl('', Validators.required),
    cashierName: new FormControl(),    
  });

  this.receiptDetails = new FormGroup({
    recieptNumber: new FormControl('', Validators.required), 
    recieptDate: new FormControl('', Validators.required),
    cashOffice: new FormControl('', Validators.required),
    comments: new FormControl('', Validators.required),
    recievedFrom: new FormControl('', Validators.required),
    pStatus: new FormControl('', Validators.required),
    paymetMethod: new FormControl('', Validators.required),
    cashier: new FormControl('', Validators.required),
    recieptAmount: new FormControl('', Validators.required),
    cancelReason: new FormControl('', Validators.required),
    appCode: new FormControl('', Validators.required),
    appDesc: new FormControl('', Validators.required),
    amtAllocated: new FormControl('', Validators.required),
  } ) ;

  this.receiptAllocation = new FormGroup({    
    appCode: new FormControl('', Validators.required),
    appDesc: new FormControl('', Validators.required),
    amtAllocated: new FormControl('', Validators.required),
  } ) ;

  this.receiptInput = new FormGroup({
    recieptNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$") ] ), 
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required),
    cashierName: new FormControl('', Validators.required),
  } ) ;
}

userName:any;
userId:any;

//Page Load 
ngOnInit() {
  this.userName =this.tokendetails.getUsername();
  if(this.userName!= null){
     
  }
  else
  this.router.navigate(['/dashboard']);   
}
//Clear the form
clear(){    
  this.receiptInput.reset();
  this.displayReport = false ;
  this.displaySearch = true ;
  this.displayRcptTable=false;
}

exit(){
  // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;
}

//To search & validate the receipt id
search(receiptInput) {  
  let rcptNo: any = this.receiptInput.value.recieptNumber; 
  if (rcptNo == null || rcptNo == false) {
    alert("Please provide Receipt Number to show Receipt Details.");
  }
  else {
    this.getRcptDetails(rcptNo);
  //  this.displayReport = true; // show container for the results
    this.displaySearch = false; // show container for the results
  }
}

//To get the receipt details based on input Receipt Id
getRcptDetails(rcptId:String) {
  this.http.get(apiURL + `/QR_rcptDtlsWithID?rcptno=${rcptId}`).subscribe(
    response => {
      this.rcptDetails=response
      if (this.rcptDetails.length > 0 ){
        this.displayReport = true; // show container for the results
        this.receiptDetails.patchValue({
          recieptNumber:this.rcptDetails[0].receipt_NO,
          recieptDate:this.rcptDetails[0].receipt_DATE,
          cashOffice:this.rcptDetails[0].cash_OFFICE_CODE,
          comments:this.rcptDetails[0].comments,
          recievedFrom:this.rcptDetails[0].received_FROM,
          pStatus:this.rcptDetails[0].posting_STATUS,
          paymetMethod:this.rcptDetails[0].pay_METHOD_CODE,
          cashier:this.rcptDetails[0].cashier_NAME,
          recieptAmount:this.rcptDetails[0].receipt_AMOUNT,
          cancelReason:this.rcptDetails[0].cancellation_REASON,
          appCode:this.rcptDetails[0].app_CODE,
          appDesc:this.rcptDetails[0].app_DESC,
          amtAllocated:this.rcptDetails[0].allocated_AMOUNT
        });
        this.receiptAllocation.patchValue({              
          appCode:this.rcptDetails[0].app_CODE,
          appDesc:this.rcptDetails[0].app_DESC,
          amtAllocated:this.rcptDetails[0].allocated_AMOUNT
        });
      }else{
        alert("Did not find Receipt Details with given input parameters");
        this.displaySearch = true; 
        this.clear();
      }
      //this.receiptDetails=response;
      //alert("user updating is successfully Updated");
    },error =>{
      alert("Did not find Receipt Details with given input parameters");
    //  console.log(error);
    }
  );
  
}

 receipt: any ; 
  displayReport = false ;
  displaySearch = true ;
  displayRcptTable=false;

  toggleDisplayReport() { 
    this.displayReport = ! this.displayReport ;
  }  
//Service call to cancel receipt 
  rcptCancel() {
    let usersBody = this.receiptDetails.value;    
    let cReason: any = this.receiptDetails.value.cancelReason;
    let Id: any = this.receiptDetails.value.recieptNumber;
    let mUser: any = this.userName;
    if (cReason == null || cReason == false){
      alert("Please select Cancellation Reason");
      //this.clear();
    }
    else {
      this.http.get(apiURL +`/receiptCancel?rID=${Id}&reason=${cReason}&user=${mUser} `).subscribe(
       response => {
          this.rcptDetails=response
          if (this.rcptDetails != null ){            
            
          }
          alert("Receipt Cancellation Successfull completed");
          this.receiptInput.reset();
          this.displayReport = false ;
          this.displaySearch = true ;
          this.displayRcptTable=false;
          //alert("user updating is successfully Updated");
        },error =>{
          alert("Did not find Receipt Details with given input parameters");
        //  console.log(error);
          this.clear();
        }
      );

    }

  }
 
}
