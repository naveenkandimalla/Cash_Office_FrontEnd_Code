import { Component, OnInit, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; 

@NgModule({
  imports: [
    FormControl,
    FormGroup, 
    FormsModule,
    ReactiveFormsModule]
})

@Component({
  selector: 'reprint-receipt',
  templateUrl: './reprint-receipt.component.html'
})
export class ReprintReceiptComponent {

  receiptInput = new FormGroup({
    receiptNumber: new FormControl('', Validators.required) } );

  onSubmit(){
    this.displayReport = true ; // show container for the results
  
    console.table(this.receiptInput.value) ;
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

  application = "Policy" ; // Or Group Life System, or Sundry Receipts
}
