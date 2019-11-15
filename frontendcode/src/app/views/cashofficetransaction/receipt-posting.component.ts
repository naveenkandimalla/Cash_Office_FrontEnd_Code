import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { PagerService, GlobalServices } from '../../services';
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
  templateUrl: 'receipt-posting.component.html'
})
export class RecieptPostingComponent {

  cashiers: any;
  receiptposting:any;
  selectedID:any;
  ReceiptDetails: FormGroup;
  ReceiptPosting: FormGroup;
  constructor(private http: HttpClient, 
              private pagerService: PagerService,
              private gs:GlobalServices,
              private router:Router,
              private tokendetails:TokenStorageService) { 
    this.ReceiptPosting = new FormGroup({
      cashierCode: new FormControl('', Validators.required), 
      cashierName: new FormControl('', Validators.required)
    } ) ;  
  }
  
  onSubmit(){       
   // console.table(this.ReceiptPosting.value) ;
  }

  userName:any;
  userId:any;
  ngOnInit() {

    this.userName =this.tokendetails.getUsername();
    if(this.userName!= null){
      this.http.get(apiURL + '/QRCashiers').subscribe(
        (response) => {
          this.cashiers = response;
        }
      );
    }
    else
    this.router.navigate(['/dashboard']);
    
  }

  namecashier_CODE:any;
  onChange(val){
    console.log("Calling onChange Event and User is:"+val);
    this.ReceiptPosting.patchValue({cashierName:val});
    //GETTING PENDING POSTED RECEIPTS
    this.http.get(apiURL + '/getRcptPostDtls?Name='+val).subscribe(
      (response) => {
        this.receiptposting = response;
        console.log(this.receiptposting);
      }
    );
  } 
  
  btnRP = false;
  populateDetails(value){
    this.selectedID=value;
    this.btnRP = true;     
  }

  post(){ 
    alert("Updating Posting Status for selected Receipt: "+this.selectedID);
    this.http.get(apiURL + '/postRcptDtls?Id='+this.selectedID).subscribe(
      (response) => {
        this.receiptposting = response;
        alert("Receipt Posting Status updated successfully for Receipt NO: "+this.selectedID);
        this.ReceiptPosting.reset();
      }
    );
    this.btnRP = false;
  }

  clear(){ 
   this.ReceiptPosting.reset(); 
   this.receiptposting=null;
  }
  
  exit(){
    window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
