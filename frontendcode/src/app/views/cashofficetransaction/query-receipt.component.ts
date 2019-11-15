
import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { apiURL } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
import { ReceiptInput } from './ReceiptInput.interface';
import { NullAstVisitor, analyzeAndValidateNgModules } from '@angular/compiler';
import { isNull } from 'util';
import { strict } from 'assert';
import{Router} from '@angular/router';
import {TokenStorageService} from '../../services/token-storage.service';

@NgModule({
  imports: [
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule]
})

@Component({
  templateUrl: './query-report.component.html'
})
export class queryReceiptComponent {

// Object Declarations.
cashiers: any;
filteredCashiers: any;
rcptDtls: any;
filteredRcptDtls :any;
rcptDetails: any;
userName:any;
userId:any;
//recAllo: any;
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
    cashierName: new FormControl(),
  });
  //receiptDetails Form Group Declaration.
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
  //receiptAllocation Form Group Declaration.
  this.receiptAllocation = new FormGroup({
    appCode: new FormControl('', Validators.required),
    appDesc: new FormControl('', Validators.required),
    amtAllocated: new FormControl('', Validators.required),
  } ) ;
  //receiptInput Form Group Declaration.
    this.receiptInput = new FormGroup({
    recieptNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$") ] ),
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required),
    cashierName: new FormControl('', Validators.required),
  } ) ;

}


  ngOnInit() {
    //Load Session values into screen and check Session varaible(UserId) availability.
    this.userName =this.tokendetails.getUsername();
    if (this.userName != null) {
      //Load Cashier details into Dropdown list.
      this.http.get(apiURL + '/QRCashiers').subscribe(
        (response) => {
          this.cashiers = response;
          this.filteredCashiers = this.cashiers;
        }
      );
    }
    //If User Session expires system will auto redirect to Login Screen.
    else
    this.router.navigate(['/dashboard']);

  }


 

clear(){
  //This method will clear all Form Controls and reset the Screen.
  this.displayReport = false ; // show container for the results
  this.displayRcptTable=false;
  this.displaySearch = true ;
  this.receiptInput.reset() ;
}

exit(){
  // Re-direct to app landing page
  window.location.href = "http://localhost:4200/#/dashboard" ;
}

//Search Method will get the data from Database based on input Parameteres
//and redirect to show complete Receipt Details
search(receiptInput) {
  let usersBody = this.receiptInput.value;
  let rcptNo: any = this.receiptInput.value.recieptNumber;
  let fDate: any = this.receiptInput.value.fromDate;
  let tDate: any = this.receiptInput.value.toDate;
  let cName: any = this.receiptInput.value.cashierName;  
  let condition: String ;
  let serviceName: any;
  //First Check Input Receipt Number is Empty or Not.
  //If yes then look for Other Input Parameters,
  //Else print respected Receipt Number details
  console.log(rcptNo) ;
  if (rcptNo == null || rcptNo == false ) {
    this.displayRcptTable=true;
    //Service request to get all receipt Details
    this.http.get(apiURL + `/QRDetails`)
      .subscribe(
        response => {
          this.rcptDtls = response;
          if (cName == null || cName == false) { }
          else {
            //Filter Receipt Details based on Cashier name
            this.rcptDtls = this.rcptDtls.filter(app => app.cashier_NAME == cName);
            this.filteredRcptDtls = this.rcptDtls;
            this.setPage(1);
          }
        }, error => { // Error Log
          alert("Error while get Receipt details");
         // console.log('oops', error)
        }
      );
  }
  //Print respected Receipt details based on Receipt Number
  else {
    //Redirect to getRcptDetails Method to get Receipt Details
    this.getRcptDetails(rcptNo);
     // show container for the results
  }

}

//Get Receipt Details based on Input Receipt Number
getRcptDetails(rcptId:String) {
  //Service Call to Get Receipt Details based on Input Receipt Number
  this.http.get(apiURL + `/QR_rcptDtlsWithID?rcptno=${rcptId}`).subscribe(
    response => {
      this.rcptDetails=response
      if (this.rcptDetails != null && this.rcptDetails.length == 1){
        //Assign receipt Details to Form Group
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
        this.displayReport = true ; // show container for the results
        this.displaySearch = false ;
      }   else{
        this.displayReport = false;
        alert("Did not find Receipt Details in DB with given input parameters");
        this.clear();
        this.displaySearch = true ;

      }
    },error =>{ //Error Log
      alert("Did not find Receipt Details with given input parameters");
     // console.log(error);
    }
  );

}

fetchActivities(rcptNo) {
  this.receiptInput.patchValue({
    rcptNo: rcptNo
  })
  this.getRcptDetails(rcptNo);
  this.displayReport = true ; // show container for the results
  this.displaySearch = false ; // show container for the results
}

//Calling method to show Receipt Details with Pagging
setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
  // get pager object from service
  this.pager = this.pagerService.getPager(this.rcptDtls.length, page, 10);
  // get current page of items
  this.pagedItems = this.rcptDtls.slice(this.pager.startIndex, this.pager.endIndex + 1);
}

  receipt: any ;
  displayReport = false ;
  displaySearch = true ;
  displayRcptTable=false;

  toggleDisplayReport() {
    this.displayReport = ! this.displayReport ;
  }
}
