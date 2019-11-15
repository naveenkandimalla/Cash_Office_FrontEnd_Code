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
  templateUrl: 'paypoint-summary.component.html'
})
export class paypointSummaryComponent {

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

  disableForm = false;

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

  //Array for Dummy data [Group Life System]
  ppReport: any[]= [
    {pp_id:1234,ppType:"E",tCode:4567,sDate:"27/09/19",nP:197,gda:566253.47},
    {pp_id:1234,ppType:"E",tCode:5567,sDate:"27/10/19",nP:755,gda:280371.33}
  ];
  totalRaisedAmount: number = 
  this.ppReport.reduce( function(accumulator, currentValue){ return accumulator +  currentValue.gda}, 0 ) ;
 
  
}
