import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule,
    Validators]
})

@Component({
  templateUrl: 'secure-loanenquire.component.html'
})
export class SecureLoanEnquireComponent {

  ReceiptPosting = new FormGroup({
  branchCode: new FormControl('', Validators.required)
  });
  Loandealdetails = new FormGroup({
    branchCode: new FormControl('', Validators.required)
    });
    Securitydetails  = new FormGroup({
        branchCode: new FormControl('', Validators.required)
        });
  onSubmit(){
    this.displayReport = true ; // show container for the results. 
  
    console.table(this.ReceiptPosting.value) ;
  }

  
  
  displayReport = false ;

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
  }
}
