import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
// import { ReceiptListingComponent } from './receipt-listing.component';
import { apiURL } from '../../_nav';
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
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
  templateUrl: './approve-receiptcancellation.component.html'
})
export class approvereceiptcancellationComponent {

  today = new Date() ;
  abc :boolean=false;
  isCollapsed: boolean = true;
  cancelDtls: any;
  pager: any = {};
  pagedItems: any[];
  receiptDetails: FormGroup;
  receiptAllocation: FormGroup;
  rcptDetails: any;

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  enable(){
    this.abc=true;
  }

  constructor(private http: HttpClient, 
              private pagerService: PagerService,
              private gs:GlobalServices,
              private router:Router,
              private tokendetails:TokenStorageService) {
  
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

}

userName:any;
userId:any;

// Page load
  ngOnInit() {
    this.userName =this.tokendetails.getUsername();
    if(this.userName!= null){
      //Service call to get the receipt details
      this.http.get(apiURL + `/QRCancelDetails`)
        .subscribe(
          response => {
            this.cancelDtls = response;          
            this.setPage(1);
          }, error => {
            alert("Error while get Receipt details");
           // console.log('oops', error)
          }
        ); 
    }
    else
    this.router.navigate(['/dashboard']);          
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.cancelDtls.length, page, 10);
    // get current page of items
    this.pagedItems = this.cancelDtls.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
 
  
  fetchActivities(rcptNo) {     
    this.getRcptDetails(rcptNo);
 //   this.displayReport = true ; // show container for the results
    this.displaySearch = false ; // show container for the results
  }

  getRcptDetails(rcptId:String) {
    this.http.get(apiURL + `/QR_rcptDtlsWithID?rcptno=${rcptId}`).subscribe(
      response => {
        this.rcptDetails=response
        if (this.rcptDetails.length > 0 ){
          this.displayReport = true ; 
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
         this.clear();

        }
        //this.receiptDetails=response;
        //alert("user updating is successfully Updated");
      },error =>{
        alert("Did not find Receipt Details with given input parameters");
      }
    );    
  }
  
  //To clear the form 
  clear(){ 
    this.displayReport = false ; // show container for the results
    //this.displayRcptTable=false;
    this.displaySearch = true ;   
    this.ngOnInit();
  }
  
  exit(){
    // Re-direct to app landing page
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

  //Service call to Approve the receipt  
  approve(){
    let cStatus: any = 'C';
    let Id: any = this.receiptDetails.value.recieptNumber;
    let mUser: any = this.userName;
    this.http.get(apiURL +`/approveReceiptCancel?rID=${Id}&status=${cStatus}&user=${mUser} `).subscribe(
      response => {
        this.rcptDetails=response        
        alert("Receipt Cancellation APPROVED Successfully");
        this.displayReport = false ; // show container for the results    
        this.displaySearch = true ;   
        this.ngOnInit();
       },error =>{
         alert("Getting error while update Receipt Details");
        // console.log(error);
         this.clear();
       }
     );
   
  }

//Service call to Disapprove the receipt 
  disApprove(){
    let cStatus: any = 'P';
    let Id: any = this.receiptDetails.value.recieptNumber;
    let mUser: any = this.userName;
    this.http.get(apiURL +`/approveReceiptCancel?rID=${Id}&status=${cStatus}&user=${mUser} `).subscribe(
      response => {
         this.rcptDetails=response
         alert("Receipt Cancellation DISAPPROVED Successfully");
        this.displayReport = false ; // show container for the results    
        this.displaySearch = true ;   
        this.ngOnInit();
         //alert("user updating is successfully Updated");
       },error =>{
         alert("Getting error while update Receipt Details");
        // console.log(error);
         this.clear();
       }
     );
  }

  receipt: any ;
  
  displayReport = false ;
  displaySearch = true ;

  toggleDisplayReport() { 
    this.displayReport = ! this.displayReport ;
  }
  
}
