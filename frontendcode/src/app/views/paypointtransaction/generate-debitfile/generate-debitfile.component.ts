// for generating debit file we need to have a data in the required period with required paypoint in the following tables
// T_BANK_TEXT_LINE,

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointtranscationComponent } from '../paypoint/paypointtranscationmodel.component'
import { PaypointTransactionService } from '../paypointtransaction.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import{Router} from '@angular/router';

@Component({
  templateUrl: './generate-debitfile.component.html'
})
export class GenerateDebitfileComponent implements OnInit {
  generateDebitFileForm: FormGroup;
  bsModalRef: BsModalRef;
  selectedPaypoint: any;
  constructor(private modalService: BsModalService, 
              private ptService: PaypointTransactionService,
              private router:Router,
              private tokendetails:TokenStorageService) {
    this.generateDebitFileForm = new FormGroup({
      paypointId: new FormControl('', Validators.required),
      paypointName: new FormControl(''),
      templateName: new FormControl(),
      period: new FormControl(),
      strikeDateFrom: new FormControl(''),
      strikeDateTo: new FormControl('')
    })
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointtranscationComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.selectedPaypoint = result[0];
      console.log(this.selectedPaypoint.paypoint_id);
      console.log(this.selectedPaypoint.payPoint_Name);
      this.generateDebitFileForm.patchValue({
        paypointId: this.selectedPaypoint.paypoint_id,
        paypointName: this.selectedPaypoint.payPoint_Name
      });
      this.ptService.getTemplateNameForPaypoint(this.selectedPaypoint.paypoint_id).subscribe(
        data => {
          console.log(data);
          if(data==null || data==""){
            alert("Template Not yet assigned to paypoint");
            this.generateDebitFileForm.reset();
          }else{
            this.generateDebitFileForm.patchValue({
              templateName: data
            })
          }
          
        },(error) =>{
          alert(error+"Please verify a template is assinged to this paypoint or not");
          console.log(error);
        }
        );
    })
  }
  
  userName:any;
  ngOnInit() {
    this.userName =this.tokendetails.getUsername();
  }
  
  generateresponseresult:any;

  onSubmit(){

 let strikedatebefore = this.generateDebitFileForm.get('strikeDateFrom').value
 let strikedateafter = this.generateDebitFileForm.get('strikeDateTo').value

       if(strikedatebefore=='' || strikedateafter=='' || strikedatebefore==null || strikedateafter==null){
        this.generateDebitFileForm.controls['strikeDateFrom'].setValue(null);
        this.generateDebitFileForm.controls['strikeDateTo'].setValue(null);
       }

    console.log(this.generateDebitFileForm.value);
    var createdby =  this.userName;
    this.ptService.generateDebitFile(this.generateDebitFileForm,createdby).subscribe(
      (response) =>{
        console.log(response);
        this.generateresponseresult = response;
       
        console.log(this.generateresponseresult.sFlag);
        
        if(this.generateresponseresult.sFlag==true){
          alert("Generated Debit File Successfully");
        }else{
          alert(this.generateresponseresult.errorMsg);
        }

        
      },(error)=>{
        console.log(error);
        alert("Error Occured While Generated Debit File");
      }
    )

  }

  Clear(){
    this.generateDebitFileForm.reset();
  }

  exit(){
   // Re-direct to app landing page
   window.location.href = "http://localhost:4200/#/dashboard" ;
  }

}
