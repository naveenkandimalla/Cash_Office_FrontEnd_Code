import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentMethod } from './paymentMethod.interface';
import { apiURL } from '../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import{Router} from '@angular/router';

@Component({
  templateUrl: 'setuppaymentmethod.component.html'
})
export class SetUpPaymentMethodComponent {

  paymentMethods: PaymentMethod[] = [];
  paymentMethod: FormGroup;
  pmtMethods :any;
  pmt: any;
  constructor(private http: HttpClient,
               private router:Router,
               private tokendetails:TokenStorageService) {
    this.paymentMethod = new FormGroup(
      {
        payMethodCode: new FormControl('',Validators.required),
        payMethodDesc: new FormControl('',Validators.required),
        enabled: new FormControl()
      }
    )
  }

  userName:any;
  userId:any;
  ngOnInit() {
    //Service Call to get all Payment Method details and display 
    let obs = this.http.get(apiURL+'/paymentMethod');
    obs.subscribe(response => {
      this.pmtMethods =response;
    }
    );

    this.userName =this.tokendetails.getUsername();
  }

  //To save the form values
  onSubmit(value) {
    if(this.paymentMethod.value.enabled)
      this.paymentMethod.controls['enabled'].setValue(1);
    else
      this.paymentMethod.controls['enabled'].setValue(0);

    //To create the paymeny method details
    this.http.post(apiURL+`/createPaymentMethod?createdby=${this.userName}`,
      this.paymentMethod.value).subscribe(
        response => {
          alert("Payment method is successfully Created/Updated");
        },(error) =>{
          alert("Error while saving payment method");
        }
      );
  }

  //To set the Payment method values to fields
  search(value){
   this.pmt=this.pmtMethods.filter(pmt =>pmt.payMethodCode == value.toUpperCase());
    if(this.pmt.length > 0){
    this.paymentMethod.setValue({
        payMethodCode:this.pmt[0].payMethodCode,
        payMethodDesc:this.pmt[0].payMethodDesc,
        enabled: this.pmt[0].enabled=="1" ? true:false
      });
    }else{
      alert("Invalid payment method code");
      this.clear();
    }
  }

   //To Assign the Payment method values to fields
  fetchPmMethods(payMethodCode,payMethodDesc){
    this.pmt=this.pmtMethods.filter(pmt =>pmt.payMethodCode == payMethodCode);
    this.paymentMethod.patchValue({
      payMethodCode: payMethodCode,
      payMethodDesc: payMethodDesc,
      enabled: this.pmt[0].enabled=="1" ? true:false
    })

  }

  //To clear the form values
  clear(){
    this.paymentMethod.setValue(
      {
        payMethodCode:'',
        payMethodDesc:'',
        enabled: false
      }
    )
  }

}
