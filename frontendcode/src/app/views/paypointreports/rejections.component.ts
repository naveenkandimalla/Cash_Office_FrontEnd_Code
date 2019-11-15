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
  templateUrl: 'rejections.component.html'
})
export class rejectionsComponent {

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
    {pp_id:1234,ppType:"Employer",pMode:"ESO(Semi-Electronic"}
  ];
   //Array for Dummy data
   ppReport2: any[]= [
    {collectionType:"Debits:",Total:234456.67},
    {collectionType:"Credits:",Total:0}
    
  ];
  ppReport3: any[]= [
    {ref_no:"00",ref_name:"Nonofo Odubegile",party_id:"445889600",policy_no:"987564896",product_code:"BMFW-1",policy_status:"inforce",dramount:2121.58},
    {ref_no:"01",ref_name:"Kate Badubi",party_id:"445589600",policy_no:"987564476",product_code:"UML2-1",policy_status:"inforce",dramount:2121.58},
    
    
  ];

  // bgn

  // states = [
  //   {name: 'Arizona', abbrev: 'AZ'},
  //   {name: 'California', abbrev: 'CA'},
  //   {name: 'Colorado', abbrev: 'CO'},
  //   {name: 'New York', abbrev: 'NY'},
  //   {name: 'Pennsylvania', abbrev: 'PA'},
  // ];
 
  // form = new FormGroup({
  //   state: new FormControl(this.states[3]),
  // });

  // end
}
