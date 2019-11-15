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
  templateUrl: './manual-adjustment.component.html'
})
export class ManualAdjustmentComponent {

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

  // An Array to hold dynamic data - Manual Adjustments:
  adjustments = [
    {
      mnAdjID: 20, policyCode: "100210611", transType: "Premium Allocation", policyID: "210611", 
      period: "21-Jun-2016", payerName: "A. B. Doe", payerNo: 14234, amount: 281.56, comments: "Unprocessed Allocation", purpose: 2, postingStatus: "POSTED", bobiRefNo: 123456, creation: "21-Jun-2012"
    },
    {
      mnAdjID: 14, policyCode: "100210617", transType: "Premium Allocation", policyID: "210617", 
      period: "21-Jan-2017", payerName: "C. D. Doe", payerNo: 15234, amount: 291.56, comments: "Review the Allocation", purpose: 4, postingStatus: "UNPOSTED", bobiRefNo: 123457, creation: "21-Jun-2013"
    },
    {
      mnAdjID: 12, policyCode: "100210618", transType: "Premium Allocation", policyID: "210618", 
      period: "21-Aug-2018", payerName: "E. F. Doe", payerNo: 16234, amount: 201.56, comments: "Unprocessed Allocation", purpose: 5, postingStatus: "POSTED", bobiRefNo: 123458, creation: "21-Jun-2014"
    }
  ]

  totalAmount: number = 
    this.adjustments.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.amount}, 0 ) ;
  
}