// sample data used for testing purpose  T_PAYPOINT_DR_HDR where FILE_STATUS in('G') [2019-05-01,2019-04-01,2011-11-01]

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { PaypointComponent } from '../../paypointmaster/paypoint/paypoint.component';
import { PaypointtranscationComponent } from '../paypoint/paypointtranscationmodel.component'
import { PaypointTransactionService } from '../paypointtransaction.service';
import { PagerService } from '../../../services';

@Component({
  templateUrl: './split-merge-search.component.html'
})
export class SplitMergeSearchComponent implements OnInit {
  splitmergeSearchForm: FormGroup;
  bsModalRef: BsModalRef;
  pager: any = {};
  pager1: any = {};
  pagedItems: any[];
  pagedItems1:any;
  splitFiles:any;
  mergeFiles:any;
  constructor(private modalService: BsModalService, private ptService: PaypointTransactionService,
    private ps:PagerService) {
    this.splitmergeSearchForm = new FormGroup({
      period: new FormControl('', Validators.required),
      paypointId: new FormControl('', Validators.required)
    })
  }
  openModalWithComponent() {
    //console.log("modal call");
    this.bsModalRef = this.modalService.show(PaypointtranscationComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.splitmergeSearchForm.patchValue({
        paypointId: result[0].paypoint_id
      });
    })
  }
  onSubmit(form) {
    console.log(form.value);
    this.ptService.searchSplitFiles(form.value).subscribe(
      (response) => {
        this.splitFiles=response;
        console.log(this.splitFiles);
        if(this.splitFiles.length==0){
          alert("NO split file details for this paypointId/Period ")
        }
        this.setPage(1);
      },
      (error) => {
        alert("Error occured while fetching Records");
        console.log(error);
      });

      this.getmergefilesearch(form);
      
  };


  // calling merge file search method

  getmergefilesearch(x){
    this.ptService.searchMergeFiles(x.value).subscribe(
      (response) => {
        this.mergeFiles=response;
        console.log(this.mergeFiles);
        if(this.mergeFiles.length==0){
          alert("NO merge file details for this paypointId/Period ")
        }
        this.setPage1(1);
      },
      (error) => {
        console.log(error);
        alert("Error occured while fetching Records");
      });
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service
    this.pager = this.ps.getPager(this.splitFiles.length, page, 5);

    // get current page of items
    this.pagedItems = this.splitFiles.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }


  setPage1(page: number) {
    if (page < 1 || page > this.pager1.totalPages) {
      return;
    }
    // get pager object from service
    this.pager1 = this.ps.getPager(this.mergeFiles.length, page, 5);

    // get current page of items
    this.pagedItems1 = this.mergeFiles.slice(this.pager1.startIndex, this.pager1.endIndex + 1);
  }
  ngOnInit() {
  }

}
