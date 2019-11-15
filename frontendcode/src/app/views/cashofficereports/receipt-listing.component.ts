import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

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
  // selector: 'app-user-management',
  templateUrl: './receipt-listing.component.html'
})
export class ReceiptListingComponent {

  listingInput = new FormGroup({
    branchCode: new FormControl('', Validators.required),
    cashOfficeCode: new FormControl('', Validators.required),
    cashierCode: new FormControl('', Validators.required),
    reportDate: new FormControl('2018-09-30', Validators.required)
  });

  displayReport = false ;

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
  }

  onSubmit(){
    console.table(this.listingInput.value) ;

    // form-processing code
    this.displayReport = true ; // show container for the results
  }

  // dbg. dummy data for receipt items
  application = "Policy" ; // Group Life System, or Sundry Receipts

  // flag for print-preview data
  printPreview = false ;

  togglePrintPreview()
  {
    this.printPreview = ! this.printPreview ;

    // call pdf print preview pop up window here
  }
}
