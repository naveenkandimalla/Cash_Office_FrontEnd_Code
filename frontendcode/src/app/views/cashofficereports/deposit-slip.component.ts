// REPRINT DEPOSIT SLIP

import { Component,NgModule, OnInit } from '@angular/core';
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
  // selector: 'app-user-management',
  templateUrl: './deposit-slip.component.html'
})
export class DepositSlipComponent {

  depositNumber = new FormControl('', [ Validators.required, Validators.pattern("^[0-9]*$") ]) ;

  // reprintReceipt = new FormGroup({}) ;

  viewReport(){
    console.log('Receipt No. ' + this.depositNumber.value) ;
    this.displayReport = true ; // show container for the results
  
  }

  displayReport = false ;

  toggleDisplayReport() { 
    this.displayReport = ! this.displayReport ;
  }

  printPreview = false ;

  togglePrintPreview()
  {
    this.printPreview = ! this.printPreview ;

    // call pdf print preview pop up window here
  }
}
