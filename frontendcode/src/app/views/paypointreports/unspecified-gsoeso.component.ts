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
  templateUrl: './unspecified-gsoeso.component.html'
})
export class UnspecifiedGsoesoComponent {

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
  receipts = [
    {
      days: 20, payMode: "DDE", bankBranch: "Gaborone Main", 
      receiptNo: "210611", rctDate: "21-Jun-2016", rcvFrom: "GSO-Permanent", 
      gross: 142.34, allocated: 281.56, rctAmnt: 314.34, unallocated:213.44
    },
    {
      days: 14, payMode: "BSO", bankBranch: "Serowe Satellite", 
      receiptNo: "210617", rctDate: "21-Jan-2017", rcvFrom: "Annuitant Staff", 
      gross: 152.34, allocated: 291.56, rctAmnt: 313.56, unallocated:323.84
    },
    {
      days: 12, payMode: "DDE", bankBranch: "Francistown", 
      receiptNo: "210618", rctDate: "21-Aug-2018", rcvFrom: "GSO-Permanent", 
      gross: 162.34, allocated: 201.56, rctAmnt: 311.75, unallocated:123.45
    }
  ]

  totalGross: number = 
    this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.gross}, 0 ) ;
  
  totalAllocated: number = 
    this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.allocated}, 0 ) ;
    
  totalReceipts: number = 
    this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.rctAmnt}, 0 ) ;
    
  totalUnallocated: number = 
    this.receipts.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.unallocated}, 0 ) ;
}