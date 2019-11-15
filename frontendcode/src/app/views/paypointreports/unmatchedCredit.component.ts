import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms'; 

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
  templateUrl: 'unmatchedCredit.component.html'
})
export class unmatchedCreditComponent {

  detailInput = new FormGroup({
    PayPointID: new FormControl('', Validators.required),
    
    Paypoint_Name: new FormControl({value:"", disabled: true}, Validators.required),
    Period: new FormControl('2018-09-30', Validators.required)
  });
 

  detailReport(){
    this.detailInput.disable() ;
    this.displayReport = true ;
    
    console.table(this.detailInput.value) ;

    // form-processing code
  }
  displayReport = false ;

  today = new Date() ;

  reportNo = 1234 ;  

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
    
    this.detailInput.enable() ;
    this.detailInput.get('Paypoint_Name').disable();
    
    
  }
  
  // paypointIds: any[]= [
  paypointIds = [ 
    {ppID:1234, ppName: "Botswana Railways"},
    {ppID:4567, ppName: "Botswana Post"},
    {ppID:4867, ppName: "Botswana Meat Commission"},
    {ppID:8897, ppName: "Botswana Life"},
    {ppID:9897, ppName: "Hollard Insurance"}
  ];

  // PayPointID1 = this.paypointIds[2] ;

 
   //Array for Dummy data
   ppReport2: any[]= [
    {collectionType:"Debits:",Total:234456.67},
    {collectionType:"Credits:",Total:0}
    
  ];
  ppReport3: any[]= [
    {ref_no:"00",ref_name:"Nonofo Odubegile",ctID:"445889600",crAmount:9875648.96},
    {ref_no:"01",ref_name:"Kate Badubi",ctID:"645589000",crAmount:987564.88},
    {ref_no:"08",ref_name:"Stewart Letunda",ctID:"945539600",crAmount:7875414.78}
    
    
  ];

  totalCredit: number = 
    this.ppReport3.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.crAmount}, 0 ) ;
}


