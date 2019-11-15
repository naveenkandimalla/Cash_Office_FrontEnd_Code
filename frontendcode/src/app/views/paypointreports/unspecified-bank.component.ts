import { Component,NgModule, OnInit } from '@angular/core';
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
  templateUrl: './unspecified-bank.component.html'
})
export class UnspecifiedBankComponent {

  unspecifiedInput = new FormGroup({
    fromDate: new FormControl('2018-09-01', Validators.required),
    toDate: new FormControl('2018-09-30', Validators.required)
  });

  onSubmit(){
    this.unspecifiedInput.disable() ;

    this.displayReport = true ; // show container for the results
  
    console.table(this.unspecifiedInput.value) ;

  }

  displayReport = false ;

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
    this.unspecifiedInput.enable() ;
  }
      
  today = new Date() ;

  reportNo = 1234 ;  

  // An Array to hold dynamic data - Bank Statements:
  bankStatements = [
    {
      stmtID: "123456", payMode: "DDE", bankName: "BARCLAYS BANK", accountNo: "0123456789", 
      stmtNo: "210611", period: "21-Jun-2016", transType: "CRE", transDesc: "CLASS PREMIUM RECEIPTS", unallocated:213.44
    },
    {
      stmtID: "123457", payMode: "BSO", bankName: "FIRST NATIONAL BANK", accountNo: "9876543210", 
      stmtNo: "210617", period: "21-Jan-2017", transType: "CRX", transDesc: "CLASS PREMIUM REVERSAL", unallocated:323.84
    },
    {
      stmtID: "123458", payMode: "DDE", bankName: "BARCLAYS BANK", accountNo: "0101010101", 
      stmtNo: "210618", period: "21-Aug-2018", transType: "CRE", transDesc: "CLASS PREMIUM RECEIPTS", unallocated:123.45
    }
  ]

  totalUnallocated: number = 
    this.bankStatements.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.unallocated}, 0 ) ;
}