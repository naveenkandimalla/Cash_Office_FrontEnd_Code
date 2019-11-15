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
  templateUrl: 'unallocated-cashReciepts.component.html'
})
export class unallocatedCashRecieptsComponent {

  detailInput = new FormGroup({
    fromDate: new FormControl('2018-09-30', Validators.required),
    to_Date: new FormControl('2018-09-30', Validators.required)
  });
 

  detailReport(){
    this.detailInput.disable() ;
    this.displayReport = true ;
    
    console.table(this.detailInput.value) ;

    // form-processing code
  }
  displayReport = false ;

  disableForm = false;

  toggleDisplayReport(){
    this.displayReport = !this.displayReport ; // false
    
    this.detailInput.enable() ;
   
    
    
  }
  
  // paypointIds: any[]= [
  records = [ 
    {ppID:1234, ppName: "Botswana Railways"},
    {ppID:4567, ppName: "Botswana Post"},
    {ppID:4867, ppName: "Botswana Meat Commission"},
    {ppID:8897, ppName: "Botswana Life"},
    {ppID:9897, ppName: "Hollard Insurance"}
  ];

  // PayPointID1 = this.paypointIds[2] ;

  //Array for Dummy data [Group Life System]
  ucrReport: any[]= [
    {p_mode:"ESO(Electronic)",rNum:"31445",brNum:234567,sDate:"27/09/19",pid:197,pname:"Zambezi Motors",branch:"Head Office",rdate:"23/09/91",ndays:31,ga:34567.35,aa:9876492.34,ra:234566.45,status:"P",uaa:566253.47},
    {p_mode:"ESO(Electronic)",rNum:"3143445",brNum:234567,sDate:"27/09/19",pid:197,pname:"Zambezi Motors",branch:"Head Office",rdate:"23/09/91",ndays:31,ga:34567.35,aa:9876492.34,ra:234566.45,status:"P",uaa:566253.47},
    {p_mode:"ESO(Electronic)",rNum:"3143945",brNum:234567,sDate:"27/09/19",pid:197,pname:"Zambezi Motors",branch:"Head Office",rdate:"23/09/91",ndays:31,ga:34567.35,aa:9876492.34,ra:234566.45,status:"P",uaa:566253.47},
    
  ];
  totalGrossAmount: number = 
  this.ucrReport.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.ga}, 0 ) ;
  totalAllocatedAmount: number = 
  this.ucrReport.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.aa}, 0 ) ;
  totalRecieptAmount: number = 
  this.ucrReport.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.ra}, 0 ) ;
  totalUnallocatedAmount: number = 
  this.ucrReport.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.uaa}, 0 ) ;
 
  today = new Date() ;

  reportNo = 1234 ;  
  
}
