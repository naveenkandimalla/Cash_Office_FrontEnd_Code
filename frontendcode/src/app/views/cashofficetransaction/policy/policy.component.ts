import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CashofficeTransactionService } from '../cashofficetransaction.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerService } from '../../../services/index';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html'
})
export class PolicyComponent implements OnInit {

  policyDetails: any;
  pager: any = {};
  pagedItems: any = [];
  policyForm: FormGroup;
  public onClose: Subject<any>;
  constructor(private ppservice: CashofficeTransactionService,
    private bsModalRef: BsModalRef, private pagerService: PagerService) {
    this.policyForm = new FormGroup({
      policyCode: new FormControl('')
    })
  }

  ngOnInit() {
    this.onClose = new Subject();
   
    // this.ppservice.getPolicyDetails(this.policyForm.value.policyCode).subscribe(
    //   response => {
    //     console.log(response);
    //     this.policyDetails = response;
    //     this.setPage(1);
    //   },
    //   error => {
    //     alert("Error at fetching Policy details");
    //   }
    // )
  }
  public populateDetails(corPolicyCode,corPeriod,corPayerName,corArrears,corExpectedAmount,corStatus) {
    this.onClose.next(this.policyDetails.filter(app => app.due_DATE  == corPeriod));
    this.bsModalRef.hide();
  }
  onSearch(value) {
    this.ppservice.getPolicyDetails(value).subscribe(
      response => {
        if(response.length > 0){
          this.policyDetails = response;
          this.setPage(1); 
        }else{
          alert("No policy code details are present with input parameter")
        }
         
      },
      error => {
        alert("Error at fetching Policy details"); 
      }
    ) 
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.policyDetails.length, page, 10);

    // get current page of items
    this.pagedItems = this.policyDetails.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
